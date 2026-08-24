import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";

class OrderRepository {
  async findCartByUser(userId) {
    return await Cart.findOne({
      user: userId,
    }).populate("items.product");
  }

  async saveCart(cart) {
    return await cart.save();
  }

  async findProductById(productId) {
    return await Product.findById(productId);
  }

  async saveProduct(product) {
    return await product.save();
  }

  async createOrder(orderData) {
    return await Order.create(orderData);
  }

  async findOrdersByBuyer(userId) {
    return await Order.find({
      buyer: userId,
    })
      .sort({ createdAt: -1 })
      .populate("orderItems.product", "name images price");
  }

  async findOrderById(orderId) {
    return await Order.findById(orderId)
      .populate("buyer", "name email")
      .populate("orderItems.product", "name images price");
  }

  async findOrderByIdWithoutPopulate(orderId) {
    return await Order.findById(orderId);
  }

  async saveOrder(order) {
    return await order.save();
  }

  async findSellerByUser(userId) {
    return await Seller.findOne({
      user: userId,
    });
  }

  async findOrdersBySeller(sellerId) {
    return await Order.find({
      "orderItems.sellerId": sellerId,
    })
      .sort({ createdAt: -1 })
      .populate("buyer", "name email");
  }
}

export default new OrderRepository();