import orderRepository from "../repositories/orderRepository.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const validTransitions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

class OrderService {
  validateShippingAddress(shippingAddress) {
    if (
      !shippingAddress ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.phone
    ) {
      throw new ErrorHandler(
        "Shipping address is required (address, city, phone)",
        400,
      );
    }
  }

  async createOrder(
    user,
    shippingAddress,
    paymentMethod = "cod",
    shippingPrice = 0,
    orderNotes = "",
  ) {
    this.validateShippingAddress(shippingAddress);

    const cart = await orderRepository.findCartByUser(
      user._id,
    );

    if (!cart || cart.items.length === 0) {
      throw new ErrorHandler("Cart is empty", 400);
    }

    const orderItems = [];
    let totalAmount = Number(shippingPrice);

    for (const item of cart.items) {
      const product = item.product;

      if (!product) {
        throw new ErrorHandler(
          "One or more products no longer exist",
          404,
        );
      }

      if (product.status !== "active") {
        throw new ErrorHandler(
          `${product.name} is not available`,
          400,
        );
      }

      if (product.stock < item.quantity) {
        throw new ErrorHandler(
          `${product.name} is out of stock (available: ${product.stock})`,
          400,
        );
      }

      product.stock -= item.quantity;
      product.sold += item.quantity;

      await orderRepository.saveProduct(product);

      orderItems.push({
        product: product._id,
        sellerId: product.seller,
        name: product.name,
        image: product.images?.[0] || {
          url: "",
          public_id: "",
        },
        price: product.price,
        quantity: item.quantity,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await orderRepository.createOrder({
      buyer: user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      shippingPrice,
      totalAmount,
      notes: orderNotes,
      status: "pending",
      paymentStatus: "pending",
    });

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;

    await orderRepository.saveCart(cart);

    return order;
  }

  async getMyOrders(user) {
    return await orderRepository.findOrdersByBuyer(
      user._id,
    );
  }

  async getOrderById(orderId, user) {
    const order =
      await orderRepository.findOrderById(orderId);

    if (!order) {
      throw new ErrorHandler("Order not found", 404);
    }

    if (
      order.buyer._id.toString() !==
        user._id.toString() &&
      user.role !== "admin"
    ) {
      throw new ErrorHandler(
        "Not authorized to view this order",
        403,
      );
    }

    return order;
  }

  async cancelOrder(orderId, user, cancelReason) {
    const order =
      await orderRepository.findOrderByIdWithoutPopulate(
        orderId,
      );

    if (!order) {
      throw new ErrorHandler("Order not found", 404);
    }

    if (
      order.buyer.toString() !==
      user._id.toString()
    ) {
      throw new ErrorHandler(
        "Unauthorized to cancel this order",
        403,
      );
    }

    if (order.status !== "pending") {
      throw new ErrorHandler(
        `Cannot cancel order with status: ${order.status}`,
        400,
      );
    }

    for (const item of order.orderItems) {
      const product =
        await orderRepository.findProductById(
          item.product,
        );

      if (product) {
        product.stock += item.quantity;
        product.sold = Math.max(
          0,
          product.sold - item.quantity,
        );

        await orderRepository.saveProduct(product);
      }
    }

    order.status = "cancelled";
    order.cancelReason =
      cancelReason ||
      "User requested cancellation";

    await orderRepository.saveOrder(order);

    return order;
  }

  async getSellerOrders(user) {
    const seller =
      await orderRepository.findSellerByUser(
        user._id,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller profile not found",
        404,
      );
    }

    const orders =
      await orderRepository.findOrdersBySeller(
        seller._id,
      );

    return orders
      .map((order) => {
        const sellerItems =
          order.orderItems.filter(
            (item) =>
              item.sellerId.toString() ===
              seller._id.toString(),
          );

        if (sellerItems.length === 0) {
          return null;
        }

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
  }

  async updateOrderStatus(
    orderId,
    user,
    status,
    trackingNumber,
  ) {
    const seller =
      await orderRepository.findSellerByUser(
        user._id,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller not found",
        404,
      );
    }

    const order =
      await orderRepository.findOrderByIdWithoutPopulate(
        orderId,
      );

    if (!order) {
      throw new ErrorHandler(
        "Order not found",
        404,
      );
    }

    const ownerOrder = order.orderItems.some(
      (item) =>
        item.sellerId.toString() ===
        seller._id.toString(),
    );

    if (!ownerOrder) {
      throw new ErrorHandler(
        "Unauthorized to update this order",
        403,
      );
    }

    if (
      !validTransitions[order.status]?.includes(status)
    ) {
      throw new ErrorHandler(
        `Cannot change order status from '${order.status}' to '${status}'`,
        400,
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

    await orderRepository.saveOrder(order);

    return order;
  }
}

export default new OrderService();