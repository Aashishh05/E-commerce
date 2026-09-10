import wishlistRepository from "../repositories/wishlistRepository.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import redisClient from "../config/redis.js";

class WishlistService {
  checkBuyer(user) {
    if (user.role !== "buyer") {
      throw new ErrorHandler("Only buyers can access the wishlist", 403);
    }
  }

  async getWishlist(user) {
    this.checkBuyer(user);

    const cacheKey = `wishlist:${user._id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    let wishlist = await wishlistRepository.findWishlistByUserWithProducts(user._id);

    if (!wishlist) {
      wishlist = await wishlistRepository.createWishlist(user._id);
    }

    await redisClient.setEx(cacheKey, 300, JSON.stringify(wishlist));
    return wishlist;
  }

  async toggleWishlist(user, productId) {
    this.checkBuyer(user);

    let wishlist = await wishlistRepository.findWishlistByUser(user._id);

    if (!wishlist) {
      wishlist = await wishlistRepository.createWishlist(user._id);
    }

    const index = wishlist.products.findIndex(
      (id) => id.toString() === productId.toString()
    );

    let action;
    if (index > -1) {
      wishlist.products.splice(index, 1);
      action = "removed";
    } else {
      wishlist.products.push(productId);
      action = "added";
    }

    await wishlistRepository.saveWishlist(wishlist);
    await redisClient.del(`wishlist:${user._id}`);

    return { action, wishlist };
  }

  async removeFromWishlist(user, productId) {
    this.checkBuyer(user);

    const wishlist = await wishlistRepository.findWishlistByUser(user._id);

    if (!wishlist) {
      throw new ErrorHandler("Wishlist not found", 404);
    }

    const index = wishlist.products.findIndex(
      (id) => id.toString() === productId.toString()
    );

    if (index === -1) {
      throw new ErrorHandler("Product not in wishlist", 404);
    }

    wishlist.products.splice(index, 1);
    await wishlistRepository.saveWishlist(wishlist);
    await redisClient.del(`wishlist:${user._id}`);

    return wishlist;
  }

  async getWishlistIds(user) {
    this.checkBuyer(user);

    const cacheKey = `wishlistIds:${user._id}`;
    const cached = await redisClient.get(cacheKey);
    if (cached) return JSON.parse(cached);

    let wishlist = await wishlistRepository.findWishlistByUser(user._id);

    if (!wishlist) {
      wishlist = await wishlistRepository.createWishlist(user._id);
    }

    const ids = wishlist.products.map((id) => id.toString());
    await redisClient.setEx(cacheKey, 300, JSON.stringify(ids));
    return ids;
  }
}

export default new WishlistService();
