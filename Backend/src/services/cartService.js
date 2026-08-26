import redisClient from "../config/redis.js";
import cartRepository from "../repositories/cartRepository.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class CartService {
  recalculateCart(cart) {
    let totalItems = 0;
    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.price;
    });

    cart.totalItems = totalItems;
    cart.totalPrice = totalPrice;
  }

  checkBuyer(user) {
    if (user.role !== "buyer") {
      throw new ErrorHandler("Only buyers can access the cart", 403);
    }
  }

  async addToCart(user, productId, quantity = 1) {
    this.checkBuyer(user);

    if (quantity < 1) {
      throw new ErrorHandler("Quantity must be at least 1", 400);
    }

    const product = await cartRepository.findProductById(productId);

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    if (product.status?.toLowerCase() !== "active") {
      throw new ErrorHandler("Product is not available", 400);
    }

    if (quantity > product.stock) {
      throw new ErrorHandler("Insufficient stock", 400);
    }

    let cart = await cartRepository.findCartByUser(user._id);

    if (!cart) {
      cart = await cartRepository.createCart(user._id);
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      throw new ErrorHandler(
        "Product already exists in cart. Use update instead.",
        400,
      );
    }

    cart.items.push({
      product: product._id,
      name: product.name,
      quantity,
      price: product.price,
      image: {
        url: product.images?.[0]?.url || "",
        public_id: product.images?.[0]?.public_id || "",
        path: product.images?.[0]?.path || "",
      },
    });

    this.recalculateCart(cart);

    const savedCart = await cartRepository.saveCart(cart);

    await redisClient.del(`cart:${user._id}`);

    return savedCart;
  }

  async getCart(user) {
    this.checkBuyer(user);

    const catchKey = `cart${user._id}`;

    const catchedCart = await redisClient.get(catchKey);

    if (catchedCart) {
      return JSON.parse(catchedCart);
    }

    let cart = await cartRepository.findCartByUserWithProducts(user._id);

    if (!cart) {
      cart = await cartRepository.createEmptyCart(user._id);
    }

    await redisClient.setEx(catchKey, JSON.stringify(cart), { EX: 300 });

    return cart;
  }

  async updateCartItem(user, productId, quantity) {
    this.checkBuyer(user);

    if (quantity < 1) {
      throw new ErrorHandler("Quantity must be at least 1", 400);
    }

    const cart = await cartRepository.findCartByUser(user._id);

    if (!cart) {
      throw new ErrorHandler("Cart not found", 404);
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (!item) {
      throw new ErrorHandler("Item not found in cart", 404);
    }

    const product = await cartRepository.findProductById(productId);

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    if (quantity > product.stock) {
      throw new ErrorHandler("Insufficient stock", 400);
    }

    item.quantity = quantity;

    this.recalculateCart(cart);

    const savedCart = await cartRepository.saveCart(cart);

    await redisClient.del(`cart:${user._id}`);

    return savedCart;
  }

  async removeFromCart(user, productId) {
    this.checkBuyer(user);

    const cart = await cartRepository.findCartByUser(user._id);

    if (!cart) {
      throw new ErrorHandler("Cart not found", 404);
    }

    const originalLength = cart.items.length;

    cart.items = cart.items.filter(
      (item) => String(item.product) !== String(productId),
    );

    if (cart.items.length === originalLength) {
      throw new ErrorHandler("Item not found in cart", 404);
    }

    this.recalculateCart(cart);
    const savedCart = await cartRepository.saveCart(cart);

    // Cart changed → remove old cache
    await redisClient.del(`cart:${user._id}`);

    return savedCart;
  }

  async deleteCart(user) {
    this.checkBuyer(user);

    const cart = await cartRepository.deleteCartByUser(user._id);

    if (!cart) {
      throw new ErrorHandler("Cart not found", 404);
    }

    await redisClient.del(`cart:${user._id}`);

    return cart;
  }
}

export default new CartService();
