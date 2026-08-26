import reviewRepository from "../repositories/reviewRepository.js";

import ErrorHandler from "../utils/ErrorHandler.js";

import redisClient from "../config/redis.js";

class ReviewService {
  async updateProductRating(productId) {
    const reviews =
      await reviewRepository.findReviewsByProductForRating(productId);

    const product = await reviewRepository.findProductById(productId);

    if (!product) {
      return;
    }

    if (reviews.length === 0) {
      product.averageRating = 0;
      product.numReviews = 0;
    } else {
      const totalRating = reviews.reduce(
        (sum, review) => sum + review.rating,
        0,
      );

      product.averageRating = Number((totalRating / reviews.length).toFixed(1));

      product.numReviews = reviews.length;
    }

    await reviewRepository.saveProduct(product);

    await redisClient.del(`product:${productId}`);
  }

  async createReview(user, productId, rating, title, comment) {
    const product = await reviewRepository.findProductById(productId);

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    const alreadyReviewed = await reviewRepository.findReviewByProductAndUser(
      productId,
      user._id,
    );

    if (alreadyReviewed) {
      throw new ErrorHandler("You have already reviewed this product", 400);
    }

    const order = await reviewRepository.findDeliveredOrderByProduct(
      user._id,
      productId,
    );

    const review = await reviewRepository.createReview({
      product: productId,
      seller: product.seller,
      user: user._id,
      order: order?._id,
      rating,
      title,
      comment,
      isVerifiedPurchase: !!order,
    });

    await this.updateProductRating(productId);

    await redisClient.del(`reviews:product:${productId}`);

    await redisClient.del(`reviews:seller:${product.seller}`);

    await redisClient.del(`reviews:user:${user._id}`);

    return review;
  }

  async getProductReviews(productId) {
    const cacheKey = `reviews:product:${productId}`;

    const cachedReviews = await redisClient.get(cacheKey);

    if (cachedReviews) {
      return JSON.parse(cachedReviews);
    }

    const reviews = await reviewRepository.findReviewsByProduct(productId);

    await redisClient.set(cacheKey, JSON.stringify(reviews), {
      EX: 300,
    });

    return reviews;
  }

  async getMyReviews(user) {
    const cacheKey = `reviews:user:${user._id}`;

    const cachedReviews = await redisClient.get(cacheKey);

    if (cachedReviews) {
      return JSON.parse(cachedReviews);
    }

    const reviews = await reviewRepository.findReviewsByUser(user._id);

    await redisClient.set(cacheKey, JSON.stringify(reviews), {
      EX: 300,
    });

    return reviews;
  }

  async getSellerReviews(user) {
    const seller = await reviewRepository.findSellerByUser(user._id);

    if (!seller) {
      throw new ErrorHandler("Seller profile not found", 404);
    }

    const cacheKey = `reviews:seller:${seller._id}`;

    const cachedReviews = await redisClient.get(cacheKey);

    if (cachedReviews) {
      return JSON.parse(cachedReviews);
    }

    const reviews = await reviewRepository.findReviewsBySeller(seller._id);

    await redisClient.set(cacheKey, JSON.stringify(reviews), {
      EX: 300,
    });

    return reviews;
  }

  async updateReview(reviewId, user, rating, title, comment) {
    const review = await reviewRepository.findReviewByIdAndUser(
      reviewId,
      user._id,
    );

    if (!review) {
      throw new ErrorHandler("Review not found", 404);
    }

    const productId = review.product;
    const sellerId = review.seller;

    review.rating = rating ?? review.rating;

    review.title = title ?? review.title;

    review.comment = comment ?? review.comment;

    await reviewRepository.saveReview(review);

    await this.updateProductRating(productId);

    await redisClient.del(`reviews:product:${productId}`);

    await redisClient.del(`reviews:user:${user._id}`);

    if (sellerId) {
      await redisClient.del(`reviews:seller:${sellerId}`);
    }

    return review;
  }

  async deleteReview(reviewId, user) {
    const review = await reviewRepository.findReviewByIdAndUser(
      reviewId,
      user._id,
    );

    if (!review) {
      throw new ErrorHandler("Review not found", 404);
    }

    const productId = review.product;
    const sellerId = review.seller;

    await reviewRepository.deleteReview(review);

    await this.updateProductRating(productId);

    await redisClient.del(`reviews:product:${productId}`);

    await redisClient.del(`reviews:user:${user._id}`);

    if (sellerId) {
      await redisClient.del(`reviews:seller:${sellerId}`);
    }
  }
}

export default new ReviewService();
