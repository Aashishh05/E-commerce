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

// Create order
export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod = "cod",
      shippingPrice = 0,
      orderNotes = "",
    } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required (address, city, phone)",
      });
    }

    // Get user's cart
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

    // Process each cart item
    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "One or more products no longer exist",
        });
      }

      if (product.status !== "active") {
        return res.status(400).json({
          success: false,
          message: `${product.name} is not available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock (available: ${product.stock})`,
        });
      }

      // Deduct from stock and add to sold
      product.stock -= item.quantity;
      product.sold += item.quantity;

      await product.save();

      // Add to order items
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

    // Create order
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

    // Clear cart
    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    // Respond with order data
    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name images price");

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
    const order = await Order.findById(req.params.id)
      .populate("buyer", "name email")
      .populate("orderItems.product", "name images price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization
    if (
      order.buyer._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
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
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check authorization
    if (order.buyer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to cancel this order",
      });
    }

    // Can only cancel pending orders
    if (order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`,
      });
    }

    // Reverse stock changes
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        product.sold = Math.max(0, product.sold - item.quantity);
        await product.save();
      }
    }

    // Update order status
    order.status = "cancelled";
    order.cancelReason = cancelReason || "User requested cancellation";
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
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

    // Find all orders containing this seller's products
    const orders = await Order.find({
      "orderItems.sellerId": seller._id,
    })
      .sort({ createdAt: -1 })
      .populate("buyer", "name email");

    // Filter to show only this seller's items in each order
    const sellerOrders = orders
      .map((order) => {
        const sellerItems = order.orderItems.filter(
          (item) => item.sellerId.toString() === seller._id.toString(),
        );

        // Only include this order if it has items from this seller
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

    // Verify seller owns this order
    const ownerOrder = order.orderItems.some(
      (item) => item.sellerId.toString() === seller._id.toString(),
    );

    if (!ownerOrder) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this order",
      });
    }

    // Validate status transition
    if (!validTransitions[order.status]?.includes(status)) {
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
