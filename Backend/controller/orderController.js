import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const validTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export const createOrder = asyncErrorHandler(async (req, res, next) => {
  const {
    shippingAddress,
    paymentMethod = "cod",
    shippingPrice = 0,
    orderNotes = "",
  } = req.body;

  if (
    !shippingAddress ||
    !shippingAddress.address ||
    !shippingAddress.city ||
    !shippingAddress.phone
  ) {
    return next(
      new ErrorHandler(
        "Shipping address is required (address, city, phone)",
        400,
      ),
    );
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart || cart.items.length === 0) {
    return next(new ErrorHandler("Cart is empty", 400));
  }

  let orderItems = [];
  let totalAmount = Number(shippingPrice);

  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      return next(
        new ErrorHandler("One or more products no longer exist", 404),
      );
    }

    if (product.status !== "active") {
      return next(new ErrorHandler(`${product.name} is not available`, 400));
    }

    if (product.stock < item.quantity) {
      return next(
        new ErrorHandler(
          `${product.name} is out of stock (available: ${product.stock})`,
          400,
        ),
      );
    }

    product.stock -= item.quantity;
    product.sold += item.quantity;
    await product.save();

    orderItems.push({
      product: product._id,
      sellerId: product.seller,
      name: product.name,
      image: product.images?.[0] || { url: "", public_id: "" },
      price: product.price,
      quantity: item.quantity,
    });

    totalAmount += product.price * item.quantity;
  }

  const order = await Order.create({
    buyer: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    shippingPrice,
    totalAmount,
    notes: orderNotes,
    status: "pending",
    paymentStatus: paymentMethod === "cod" ? "pending" : "unpaid",
  });

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
});

export const getMyOrders = asyncErrorHandler(async (req, res, next) => {
  const orders = await Order.find({ buyer: req.user._id })
    .sort({ createdAt: -1 })
    .populate("orderItems.product", "name images price");

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

export const getOrderById = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("buyer", "name email")
    .populate("orderItems.product", "name images price");

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (
    order.buyer._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorHandler("Not authorized to view this order", 403));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const cancelOrder = asyncErrorHandler(async (req, res, next) => {
  const { cancelReason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  if (order.buyer.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Unauthorized to cancel this order", 403));
  }

  if (order.status !== "pending") {
    return next(
      new ErrorHandler(`Cannot cancel order with status: ${order.status}`, 400),
    );
  }

  for (const item of order.orderItems) {
    const product = await Product.findById(item.product);

    if (product) {
      product.stock += item.quantity;
      product.sold = Math.max(0, product.sold - item.quantity);
      await product.save();
    }
  }

  order.status = "cancelled";
  order.cancelReason = cancelReason || "User requested cancellation";
  await order.save();

  res.status(200).json({
    success: true,
    message: "Order cancelled successfully",
    data: order,
  });
});

export const getSellerOrders = asyncErrorHandler(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) {
    return next(new ErrorHandler("Seller profile not found", 404));
  }

  const orders = await Order.find({
    "orderItems.sellerId": seller._id,
  })
    .sort({ createdAt: -1 })
    .populate("buyer", "name email");

  const sellerOrders = orders
    .map((order) => {
      const sellerItems = order.orderItems.filter(
        (item) => item.sellerId.toString() === seller._id.toString(),
      );

      if (sellerItems.length === 0) return null;

      return {
        _id: order._id,
        orderId: order.orderId,
        buyer: order.buyer,
        shippingAddress: order.shippingAddress,
        status: order.status,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber,
        isDelivered: order.isDelivered,
        deliveredAt: order.deliveredAt,
        createdAt: order.createdAt,
        orderItems: sellerItems,
      };
    })
    .filter((order) => order !== null);

  res.status(200).json({
    success: true,
    count: sellerOrders.length,
    data: sellerOrders,
  });
});

export const updateOrderStatus = asyncErrorHandler(async (req, res, next) => {
  const { status, trackingNumber } = req.body;

  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  const ownerOrder = order.orderItems.some(
    (item) => item.sellerId.toString() === seller._id.toString(),
  );

  if (!ownerOrder) {
    return next(new ErrorHandler("Unauthorized to update this order", 403));
  }

  if (!validTransitions[order.status]?.includes(status)) {
    return next(
      new ErrorHandler(
        `Cannot change order status from '${order.status}' to '${status}'`,
        400,
      ),
    );
  }

  order.status = status;

  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  if (status === "delivered") {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();

  res.status(200).json({
    success: true,
    message: "Order status updated successfully",
    data: order,
  });
});
