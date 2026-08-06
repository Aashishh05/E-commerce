import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const updateProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const product = await Product.findById(productId);

  if (!product) return;

  if (reviews.length === 0) {
    product.averageRating = 0;
    product.numReviews = 0;
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    product.averageRating = Number((totalRating / reviews.length).toFixed(1));
    product.numReviews = reviews.length;
  }

  await product.save();
};

export const createReview = asyncErrorHandler(async (req, res, next) => {
  const { productId, rating, title, comment } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const alreadyReviewed = await Review.findOne({
    product: productId,
    user: req.user._id,
  });

  if (alreadyReviewed) {
    return next(
      new ErrorHandler("You have already reviewed this product", 400),
    );
  }

  const order = await Order.findOne({
    user: req.user._id,
    orderStatus: "delivered",
    "items.product": productId,
  });

  const review = await Review.create({
    product: productId,
    seller: product.seller,
    user: req.user._id,
    order: order?._id,
    rating,
    title,
    comment,
    isVerifiedPurchase: !!order,
  });

  await updateProductRating(productId);

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    review,
  });
});

export const getProductReviews = asyncErrorHandler(async (req, res, next) => {
  const reviews = await Review.find({ product: req.params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getMyReviews = asyncErrorHandler(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user._id })
    .populate("product", "name images averageRating")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getSellerReviews = asyncErrorHandler(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) {
    return next(new ErrorHandler("Seller profile not found", 404));
  }

  const reviews = await Review.find({ seller: seller._id })
    .populate("product", "name images")
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const updateReview = asyncErrorHandler(async (req, res, next) => {
  const review = await Review.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  review.rating = req.body.rating ?? review.rating;
  review.title = req.body.title ?? review.title;
  review.comment = req.body.comment ?? review.comment;

  await review.save();

  await updateProductRating(review.product);

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review,
  });
});

export const deleteReview = asyncErrorHandler(async (req, res, next) => {
  const review = await Review.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!review) {
    return next(new ErrorHandler("Review not found", 404));
  }

  const productId = review.product;

  await review.deleteOne();

  await updateProductRating(productId);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
