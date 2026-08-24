import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import cartService from "../services/cartService.js";

export const addToCart = asyncErrorHandler(async (req, res) => {
  const { product, quantity = 1 } = req.body;

  const cart = await cartService.addToCart(req.user, product, quantity);

  res.status(201).json({
    success: true,
    message: "Item added to cart successfully",
    data: cart,
  });
});

export const getCart = asyncErrorHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user);

  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const updateCartItem = asyncErrorHandler(async (req, res) => {
  const { quantity } = req.body;

  const cart = await cartService.updateCartItem(
    req.user,
    req.params.id,
    quantity,
  );

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
});

export const removeFromCart = asyncErrorHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user, req.params.id);

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: cart,
  });
});

export const deleteCart = asyncErrorHandler(async (req, res) => {
  await cartService.deleteCart(req.user);

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});
