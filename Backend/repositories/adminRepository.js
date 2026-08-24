import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";
import Category from "../models/categoriesModel.js";

class AdminRepository {
  // ==================== USERS ====================

  async findAllUsers(filter, skip, limit) {
    return await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countUsers(filter) {
    return await User.countDocuments(filter);
  }

  async findUserById(id) {
    return await User.findById(id).select("-password");
  }

  async findUserByIdWithPassword(id) {
    return await User.findById(id);
  }

  async saveUser(user) {
    return await user.save();
  }

  async deleteUserById(id) {
    return await User.findByIdAndDelete(id);
  }

  // ==================== SELLERS ====================

  async findAllSellers(skip, limit) {
    return await Seller.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countSellers() {
    return await Seller.countDocuments();
  }

  async findSellerById(id) {
    return await Seller.findById(id).populate(
      "user",
      "name email role"
    );
  }

  async findSellerByIdWithoutPopulate(id) {
    return await Seller.findById(id);
  }

  async saveSeller(seller) {
    return await seller.save();
  }

  // ==================== CATEGORIES ====================

  async findCategoryByName(nameRegex) {
    return await Category.findOne({
      name: {
        $regex: nameRegex,
        $options: "i",
      },
    });
  }

  async findCategoryByNameExceptId(nameRegex, id) {
    return await Category.findOne({
      name: {
        $regex: nameRegex,
        $options: "i",
      },
      _id: {
        $ne: id,
      },
    });
  }

  async createCategory(categoryData) {
    return await Category.create(categoryData);
  }

  async findAllCategories(filter, skip, limit) {
    return await Category.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countCategories(filter) {
    return await Category.countDocuments(filter);
  }

  async findCategoryById(id) {
    return await Category.findById(id);
  }

  async saveCategory(category) {
    return await category.save();
  }

  async deleteCategory(category) {
    return await category.deleteOne();
  }

  // ==================== PRODUCTS ====================

  async findAllProducts(query, skip, limit) {
    return await Product.find(query)
      .populate({
        path: "seller",
        select: "shopName verificationStatus isVerified",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countProducts(query) {
    return await Product.countDocuments(query);
  }

  async findProductById(id) {
    return await Product.findById(id);
  }

  async deleteProductById(id) {
    return await Product.findByIdAndDelete(id);
  }

  async deleteProductReviews(productId) {
    return await Review.deleteMany({
      product: productId,
    });
  }

  async removeProductFromCarts(productId) {
    return await Cart.updateMany(
      {},
      {
        $pull: {
          items: {
            product: productId,
          },
        },
      }
    );
  }

  // ==================== ORDERS ====================

  async findAllOrders(query, skip, limit) {
    return await Order.find(query)
      .populate({
        path: "buyer",
        select: "name email",
      })
      .populate({
        path: "orderItems.product",
        select: "name price images",
      })
      .populate({
        path: "orderItems.sellerId",
        select: "shopName",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countOrders(query) {
    return await Order.countDocuments(query);
  }

  async findOrderById(id) {
    return await Order.findById(id)
      .populate({
        path: "buyer",
        select: "name email phone address",
      })
      .populate({
        path: "orderItems.product",
        select: "name price images description",
      })
      .populate({
        path: "orderItems.sellerId",
        select: "shopName",
      });
  }

  // ==================== USER RELATED DATA ====================

  async deleteProductsBySeller(sellerId) {
    return await Product.deleteMany({
      seller: sellerId,
    });
  }

  async deleteReviewsByUser(userId) {
    return await Review.deleteMany({
      user: userId,
    });
  }

  async deleteCartByUser(userId) {
    return await Cart.deleteOne({
      user: userId,
    });
  }

  async deleteOrdersByUser(userId) {
    return await Order.deleteMany({
      user: userId,
    });
  }

  // ==================== DASHBOARD ====================

  async countBuyerUsers() {
    return await User.countDocuments({
      role: "buyer",
    });
  }

  async countActiveSellers() {
    return await Seller.countDocuments({
      verificationStatus: "approved",
    });
  }

  async countProductsForDashboard() {
    return await Product.countDocuments();
  }

  async countCategoriesForDashboard() {
    return await Category.countDocuments();
  }

  async countOrdersForDashboard() {
    return await Order.countDocuments();
  }

  async getRevenueData() {
    return await Order.aggregate([
      {
        $match: {
          status: "delivered",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);
  }

  async getOrderStatusStats() {
    return await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
    ]);
  }
}

export default new AdminRepository();