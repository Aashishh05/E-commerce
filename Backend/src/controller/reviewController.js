import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import reviewService from "../services/reviewService.js";

export const createReview = asyncErrorHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;

  const review = await reviewService.createReview(
    req.user,
    productId,
    rating,
    title,
    comment,
  );

  res.status(201).json({
    success: true,
    message: "Review created successfully",
    review,
  });
});

export const getProductReviews = asyncErrorHandler(async (req, res) => {
  const reviews = await reviewService.getProductReviews(req.params.id);

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getMyReviews = asyncErrorHandler(async (req, res) => {
  const reviews = await reviewService.getMyReviews(req.user);

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const getSellerReviews = asyncErrorHandler(async (req, res) => {
  const reviews = await reviewService.getSellerReviews(req.user);

  res.status(200).json({
    success: true,
    count: reviews.length,
    reviews,
  });
});

export const updateReview = asyncErrorHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.params.id,
    req.user,
    req.body.rating,
    req.body.title,
    req.body.comment,
  );

  res.status(200).json({
    success: true,
    message: "Review updated successfully",
    review,
  });
});

export const deleteReview = asyncErrorHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user);

  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});
