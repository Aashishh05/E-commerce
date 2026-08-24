import reviewRepository from "../repositories/reviewRepository.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class ReviewService {
  async updateProductRating(productId) {
    const reviews =
      await reviewRepository.findReviewsByProductForRating(
        productId,
      );

    const product =
      await reviewRepository.findProductById(
        productId,
      );

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

      product.averageRating = Number(
        (totalRating / reviews.length).toFixed(1),
      );

      product.numReviews = reviews.length;
    }

    await reviewRepository.saveProduct(product);
  }

  async createReview(
    user,
    productId,
    rating,
    title,
    comment,
  ) {
    const product =
      await reviewRepository.findProductById(
        productId,
      );

    if (!product) {
      throw new ErrorHandler(
        "Product not found",
        404,
      );
    }

    const alreadyReviewed =
      await reviewRepository.findReviewByProductAndUser(
        productId,
        user._id,
      );

    if (alreadyReviewed) {
      throw new ErrorHandler(
        "You have already reviewed this product",
        400,
      );
    }

    const order =
      await reviewRepository.findDeliveredOrderByProduct(
        user._id,
        productId,
      );

    const review =
      await reviewRepository.createReview({
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

    return review;
  }

  async getProductReviews(productId) {
    return await reviewRepository.findReviewsByProduct(
      productId,
    );
  }

  async getMyReviews(user) {
    return await reviewRepository.findReviewsByUser(
      user._id,
    );
  }

  async getSellerReviews(user) {
    const seller =
      await reviewRepository.findSellerByUser(
        user._id,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller profile not found",
        404,
      );
    }

    return await reviewRepository.findReviewsBySeller(
      seller._id,
    );
  }

  async updateReview(
    reviewId,
    user,
    rating,
    title,
    comment,
  ) {
    const review =
      await reviewRepository.findReviewByIdAndUser(
        reviewId,
        user._id,
      );

    if (!review) {
      throw new ErrorHandler(
        "Review not found",
        404,
      );
    }

    review.rating = rating ?? review.rating;
    review.title = title ?? review.title;
    review.comment = comment ?? review.comment;

    await reviewRepository.saveReview(review);

    await this.updateProductRating(review.product);

    return review;
  }

  async deleteReview(reviewId, user) {
    const review =
      await reviewRepository.findReviewByIdAndUser(
        reviewId,
        user._id,
      );

    if (!review) {
      throw new ErrorHandler(
        "Review not found",
        404,
      );
    }

    const productId = review.product;

    await reviewRepository.deleteReview(review);

    await this.updateProductRating(productId);
  }
}

export default new ReviewService();