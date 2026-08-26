import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

class CartRepository {
  async findCartByUser(userId) {
    return await Cart.findOne({ user: userId });
  }

  async findCartByUserWithProducts(userId) {
    return await Cart.findOne({ user: userId }).populate("items.product");
  }

  async createCart(userId) {
    return await Cart.create({
      user: userId,
      items: [],
    });
  }

  async createEmptyCart(userId) {
    return await Cart.create({
      user: userId,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  }

  async saveCart(cart) {
    return await cart.save();
  }

  async deleteCartByUser(userId) {
    return await Cart.findOneAndDelete({
      user: userId,
    });
  }

  async findProductById(productId) {
    return await Product.findById(productId);
  }
}

export default new CartRepository();
