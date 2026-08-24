import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";

class ReviewRepository {
  async findProductById(productId) {
    return await Product.findById(productId);
  }

  async findReviewByProductAndUser(productId, userId) {
    return await Review.findOne({
      product: productId,
      user: userId,
    });
  }

  async findDeliveredOrderByProduct(userId, productId) {
    return await Order.findOne({
      user: userId,
      orderStatus: "delivered",
      "items.product": productId,
    });
  }

  async createReview(reviewData) {
    return await Review.create(reviewData);
  }

  async findReviewsByProduct(productId) {
    return await Review.find({
      product: productId,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 });
  }

  async findReviewsByUser(userId) {
    return await Review.find({
      user: userId,
    })
      .populate(
        "product",
        "name images averageRating",
      )
      .sort({ createdAt: -1 });
  }

  async findSellerByUser(userId) {
    return await Seller.findOne({
      user: userId,
    });
  }

  async findReviewsBySeller(sellerId) {
    return await Review.find({
      seller: sellerId,
    })
      .populate("product", "name images")
      .populate("user", "name email")
      .sort({ createdAt: -1 });
  }

  async findReviewByIdAndUser(reviewId, userId) {
    return await Review.findOne({
      _id: reviewId,
      user: userId,
    });
  }

  async findReviewsByProductForRating(productId) {
    return await Review.find({
      product: productId,
    });
  }

  async saveReview(review) {
    return await review.save();
  }

  async deleteReview(review) {
    return await review.deleteOne();
  }

  async saveProduct(product) {
    return await product.save();
  }
}

export default new ReviewRepository();