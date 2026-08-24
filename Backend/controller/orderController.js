import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import orderService from "../services/orderService.js";

export const createOrder = asyncErrorHandler(
  async (req, res) => {
    const {
      shippingAddress,
      paymentMethod = "cod",
      shippingPrice = 0,
      orderNotes = "",
    } = req.body;

    const order = await orderService.createOrder(
      req.user,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      orderNotes,
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  },
);

export const getMyOrders = asyncErrorHandler(
  async (req, res) => {
    const orders =
      await orderService.getMyOrders(req.user);

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  },
);

export const getOrderById = asyncErrorHandler(
  async (req, res) => {
    const order =
      await orderService.getOrderById(
        req.params.id,
        req.user,
      );

    res.status(200).json({
      success: true,
      data: order,
    });
  },
);

export const cancelOrder = asyncErrorHandler(
  async (req, res) => {
    const { cancelReason } = req.body;

    const order =
      await orderService.cancelOrder(
        req.params.id,
        req.user,
        cancelReason,
      );

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  },
);

export const getSellerOrders = asyncErrorHandler(
  async (req, res) => {
    const sellerOrders =
      await orderService.getSellerOrders(
        req.user,
      );

    res.status(200).json({
      success: true,
      count: sellerOrders.length,
      data: sellerOrders,
    });
  },
);

export const updateOrderStatus = asyncErrorHandler(
  async (req, res) => {
    const { status, trackingNumber } = req.body;

    const order =
      await orderService.updateOrderStatus(
        req.params.id,
        req.user,
        status,
        trackingNumber,
      );

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  },
);