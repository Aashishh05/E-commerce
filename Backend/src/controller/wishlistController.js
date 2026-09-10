import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import wishlistService from "../services/wishlistService.js";

export const getWishlist = asyncErrorHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user);

  res.status(200).json({
    success: true,
    data: wishlist,
  });
});

export const toggleWishlist = asyncErrorHandler(async (req, res) => {
  const { productId } = req.body;

  const result = await wishlistService.toggleWishlist(req.user, productId);

  res.status(200).json({
    success: true,
    message: result.action === "added"
      ? "Product added to wishlist"
      : "Product removed from wishlist",
    data: result,
  });
});

export const removeFromWishlist = asyncErrorHandler(async (req, res) => {
  const wishlist = await wishlistService.removeFromWishlist(
    req.user,
    req.params.productId
  );

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist",
    data: wishlist,
  });
});

export const getWishlistIds = asyncErrorHandler(async (req, res) => {
  const ids = await wishlistService.getWishlistIds(req.user);

  res.status(200).json({
    success: true,
    data: ids,
  });
});
