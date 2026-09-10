import Wishlist from "../models/wishlistModel.js";

class WishlistRepository {
  async findWishlistByUser(userId) {
    return await Wishlist.findOne({ user: userId });
  }

  async findWishlistByUserWithProducts(userId) {
    return await Wishlist.findOne({ user: userId }).populate("products");
  }

  async createWishlist(userId) {
    return await Wishlist.create({
      user: userId,
      products: [],
    });
  }

  async saveWishlist(wishlist) {
    return await wishlist.save();
  }
}

export default new WishlistRepository();
