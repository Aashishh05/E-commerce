import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Helper: Check buyer role and handle responses cleanly
const isNotBuyer = (req, res) => {
  if (req.user.role !== "buyer") {
    res.status(403).json({
      success: false,
      message: "Only buyers can access the cart",
    });
    return true; // Yes, it is NOT a buyer (block execution)
  }
  return false; // No, it's fine (continue execution)
};

// Helper: Recalculate cart totals dynamically
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

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    if (isNotBuyer(req, res)) return;

    const { product, quantity = 1 } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const prod = await Product.findById(product);

    if (!prod) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (prod.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Product is not available",
      });
    }

    if (quantity > prod.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
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
      return res.status(400).json({
        success: false,
        message: "Product already exists in cart. Use update instead.",
      });
    }

    // Map the product object properties directly to match your Cart Schema
    cart.items.push({
      product: prod._id,
      name: prod.name,
      quantity,
      price: prod.price,
      image: {
        url: prod.images?.url || "",
        public_id: prod.images?.public_id || "",
        path: prod.images?.path || "",
      },
    });

    recalculateCart(cart);
    await cart.save();

    res.status(201).json({
      success: true,
      message: "Item added to cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    if (isNotBuyer(req, res)) return;

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Cart Item Quantity
export const updateCartItem = async (req, res) => {
  try {
    if (isNotBuyer(req, res)) return;

    const { product, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find((item) => item.product.toString() === product);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    const prod = await Product.findById(product);

    if (!prod) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (quantity > prod.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock",
      });
    }

    item.quantity = quantity;

    recalculateCart(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Item from Cart
export const removeFromCart = async (req, res) => {
  try {
    if (isNotBuyer(req, res)) return;

    const productId = String(req.params.id);
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => String(item.product) !== productId,
    );

    if (cart.items.length === originalLength) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    recalculateCart(cart);
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete / Clear Whole Cart
export const deleteCart = async (req, res) => {
  try {
    if (isNotBuyer(req, res)) return;

    const cart = await Cart.findOneAndDelete({
      user: req.user._id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
