import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";

const validTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

//Create order

export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "cod",
      shippingPrice = 0,
    } = req.body;

    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
    );
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let orderItems = [];
    let totalAmount = Number(shippingPrice);

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One or more products no longer exist",
        });
      }

      if (product.status !== "Active") {
        return res.status(400).json({
          success: false,
          message: `${product.name} is not available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      product.stock -= item.quantity;
      product.sold += item.quantity;

      await product.save();

      orderItems.push({
        product: product._id,
        sellerId: product.seller,
        name: product.name,
        image: product.images,
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "buyer",
      "name email",
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const { cancelReason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Order cannot be cancelled" });
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
    order.cancelReason = cancelReason;

    await order.save();

    res.status(200).json({ success: true, message: "Order cancelled" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSellerOrders = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller profile not found",
      });
    }

    const orders = await Order.find({
      "orderItems.sellerId": seller._id,
    }).sort({ createdAt: -1 });

    const sellerOrders = orders.map((order) => {
      const sellerItems = order.orderItems.filter(
        (item) => item.sellerId.toString() === seller._id.toString(),
      );

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
    });

    res.status(200).json({
      success: true,
      count: sellerOrders.length,
      data: sellerOrders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const seller = await Seller.findOne({ user: req.user._id });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const ownerOrder = order.orderItems.some(
      (item) => item.sellerId.toString() === seller._id.toString(),
    );

    if (!ownerOrder) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!validTransitions[order.status].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change order status from '${order.status}' to '${status}'`,
      });
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};