import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

const recalculateCart = (cart) => {
  let totalItems = 0;
  let totalPrice = 0;

  cart.items.forEach((item) => {
    totalItems += item.quantity;
    totalPrice += item.quantity * item.price;
  });

  cart.totalItems = totalItems;
  cart.totalPrice = totalPrice;
};

export const addToCart = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "buyer") {
    return next(new ErrorHandler("Only buyers can access the cart", 403));
  }

  const { product, quantity = 1 } = req.body;

  if (quantity < 1) {
    return next(new ErrorHandler("Quantity must be at least 1", 400));
  }

  const prod = await Product.findById(product);

  if (!prod) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (prod.status?.toLowerCase() !== "active") {
    return next(new ErrorHandler("Product is not available", 400));
  }

  if (quantity > prod.stock) {
    return next(new ErrorHandler("Insufficient stock", 400));
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === product,
  );

  if (existingItem) {
    return next(
      new ErrorHandler(
        "Product already exists in cart. Use update instead.",
        400,
      ),
    );
  }

  cart.items.push({
    product: prod._id,
    name: prod.name,
    quantity,
    price: prod.price,
    image: {
      url: prod.images?.[0]?.url || "",
      public_id: prod.images?.[0]?.public_id || "",
      path: prod.images?.[0]?.path || "",
    },
  });

  recalculateCart(cart);
  await cart.save();

  res.status(201).json({
    success: true,
    message: "Item added to cart successfully",
    data: cart,
  });
});

export const getCart = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "buyer") {
    return next(new ErrorHandler("Only buyers can access the cart", 403));
  }

  let cart = await Cart.findOne({ user: req.user._id }).populate(
    "items.product",
  );

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
      totalItems: 0,
      totalPrice: 0,
    });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

export const updateCartItem = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "buyer") {
    return next(new ErrorHandler("Only buyers can access the cart", 403));
  }

  const product = req.params.id;
  const { quantity } = req.body;

  if (quantity < 1) {
    return next(new ErrorHandler("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const item = cart.items.find((item) => item.product.toString() === product);

  if (!item) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  const prod = await Product.findById(product);

  if (!prod) {
    return next(new ErrorHandler("Product not found", 404));
  }

  if (quantity > prod.stock) {
    return next(new ErrorHandler("Insufficient stock", 400));
  }

  item.quantity = quantity;

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cart,
  });
});

export const removeFromCart = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "buyer") {
    return next(new ErrorHandler("Only buyers can access the cart", 403));
  }

  const productId = String(req.params.id);
  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  const originalLength = cart.items.length;

  cart.items = cart.items.filter((item) => String(item.product) !== productId);

  if (cart.items.length === originalLength) {
    return next(new ErrorHandler("Item not found in cart", 404));
  }

  recalculateCart(cart);
  await cart.save();

  res.status(200).json({
    success: true,
    message: "Product removed from cart successfully",
    data: cart,
  });
});

export const deleteCart = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "buyer") {
    return next(new ErrorHandler("Only buyers can access the cart", 403));
  }

  const cart = await Cart.findOneAndDelete({ user: req.user._id });

  if (!cart) {
    return next(new ErrorHandler("Cart not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Cart cleared successfully",
  });
});
