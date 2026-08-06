import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";
import Category from "../models/categoriesModel.js";
import mongoose from "mongoose";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import fs from "fs";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const search = req.query.search || "";
  const role = req.query.role;

  const filter = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (role) {
    filter.role = role;
  }

  const users = await User.find(filter)
    .select("-password")
    .sort({
      createdAt: -1,
    })
    .skip(skip)
    .limit(limit);

  const totalUsers = await User.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    count: users.length,
    totalUsers: totalUsers,
    currentPage: page,
    totalPages: Math.ceil(totalUsers / limit),
    data: { users },
  });
});

export const getUserById = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: { user },
  });
});

export const toggleUserStatus = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.role === "admin") {
    return next(new ErrorHandler("Admin account cannot be blocked", 403));
  }

  user.isActive = !user.isActive;

  await user.save();

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
    data: user,
  });
});

export const deleteUser = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid user ID", 400));
  }

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (user.role === "admin") {
    return next(new ErrorHandler("Admin account cannot be deleted", 403));
  }

  if (user._id.toString() === req.user.id.toString()) {
    return next(new ErrorHandler("You cannot delete your own account", 403));
  }

  if (user.role === "seller") {
    await Product.deleteMany({
      seller: user._id,
    });
  }

  await Review.deleteMany({
    user: user._id,
  });

  await Cart.deleteOne({
    user: user._id,
  });

  await Order.deleteMany({
    user: user._id,
  });

  await User.findByIdAndDelete(user._id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const getAllSellers = asyncErrorHandler(async (req, res, next) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 10, 1);
  const skip = (page - 1) * limit;

  const total = await Seller.countDocuments();

  const sellers = await Seller.find()
    .populate("user", "name email role")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: sellers.length,
    total_seller: total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    data: { sellers },
  });
});

export const getSellerById = asyncErrorHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id).populate(
    "user",
    "name email role",
  );

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  res.status(200).json({
    success: true,
    data: seller,
  });
});

export const verifySeller = asyncErrorHandler(async (req, res, next) => {
  if (!req.body) {
    return next(new ErrorHandler("Request body is missing", 400));
  }

  const { status } = req.body;

  if (!status) {
    return next(new ErrorHandler("Status is required", 400));
  }

  const normalizedStatus = status.trim().toLowerCase();

  if (!["approved", "pending", "rejected"].includes(normalizedStatus)) {
    return next(
      new ErrorHandler("Status must be approved, pending, or rejected", 400),
    );
  }

  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  seller.verificationStatus = normalizedStatus;
  seller.isVerified = normalizedStatus === "approved";

  await seller.save();

  res.status(200).json({
    success: true,
    message: `Seller ${normalizedStatus} successfully`,
    data: seller,
  });
});

export const blockSeller = asyncErrorHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  if (seller.verificationStatus === "blocked") {
    seller.verificationStatus = "approved";
  } else {
    seller.verificationStatus = "blocked";
  }

  await seller.save();

  res.status(200).json({
    success: true,
    message: `Seller ${
      seller.verificationStatus === "blocked" ? "blocked" : "unblocked"
    } successfully`,
    data: { seller },
  });
});

/* ═══════════════════════════════════════════════════════════════
   CATEGORY MANAGEMENT
   ═══════════════════════════════════════════════════════════════ */

export const createCategory = asyncErrorHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    return next(new ErrorHandler("Category name is required", 400));
  }

  const trimmedName = name.trim();

  const existingCategory = await Category.findOne({
    name: {
      $regex: new RegExp(`^${trimmedName}$`, "i"),
    },
  });

  if (existingCategory) {
    return next(
      new ErrorHandler("Category with this name already exists", 400),
    );
  }

  let image = {};

  if (req.file) {
    const uploadImage = await UploadToCloudinary(
      req.file.buffer,
      "E-commerce/Categories",
    );

    image = {
      url: uploadImage.url,
      public_id: uploadImage.public_id,
      path: uploadImage.path,
    };

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }

  const category = await Category.create({
    name: trimmedName,
    description: description?.trim(),
    image,
  });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const getAllCategories = asyncErrorHandler(async (req, res, next) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 100);
  const skip = (page - 1) * limit;
  const search = req.query.search || "";

  const filter = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const totalCategories = await Category.countDocuments(filter);

  const categories = await Category.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    count: categories.length,
    totalCategories,
    currentPage: page,
    totalPages: Math.ceil(totalCategories / limit),
    data: categories,
  });
});

export const getCategoryById = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  res.status(200).json({
    success: true,
    data: category,
  });
});

export const updateCategory = asyncErrorHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name && !description && !req.file) {
    return next(new ErrorHandler("Provide at least one field to update", 400));
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (name) {
    const trimmedName = name.trim();

    const existingCategory = await Category.findOne({
      name: {
        $regex: new RegExp(`^${trimmedName}$`, "i"),
      },
      _id: {
        $ne: req.params.id,
      },
    });

    if (existingCategory) {
      return next(
        new ErrorHandler("Another category with this name already exists", 400),
      );
    }

    category.name = trimmedName;
  }

  if (description) {
    category.description = description.trim();
  }

  if (req.file) {
    if (category.image?.public_id) {
      await deleteCloudinaryImage(category.image.public_id);
    }

    const uploadImage = await UploadToCloudinary(
      req.file.buffer,
      "E-commerce/Categories",
    );

    category.image = {
      url: uploadImage.url,
      public_id: uploadImage.public_id,
      path: uploadImage.path,
    };

    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }

  await category.save();

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
    data: category,
  });
});

export const deleteCategory = asyncErrorHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (category.image?.public_id) {
    await deleteCloudinaryImage(category.image.public_id);
  }

  await category.deleteOne();

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export const getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const search = req.query.search || "";
  const category = req.query.category;
  const seller = req.query.seller;
  const status = req.query.status;

  const query = {};

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    query.category = category;
  }

  if (seller) {
    query.seller = seller;
  }

  if (status) {
    query.status = status;
  }

  const totalProducts = await Product.countDocuments(query);

  const products = await Product.find(query)
    .populate({
      path: "seller",
      select: "shopName verificationStatus isVerified",
    })
    .populate({
      path: "category",
      select: "name",
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: products.length,
    totalProducts,
    currentPage: page,
    totalPages: Math.ceil(totalProducts / limit),
    data: products,
  });
});

export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await Review.deleteMany({
    product: product._id,
  });

  await Cart.updateMany(
    {},
    {
      $pull: {
        items: {
          product: product._id,
        },
      },
    },
  );

  await Product.findByIdAndDelete(product._id);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const status = req.query.status;
  const paymentStatus = req.query.paymentStatus;
  const buyer = req.query.buyer;

  const query = {};

  if (status) {
    query.status = status;
  }

  if (paymentStatus) {
    query.paymentStatus = paymentStatus;
  }

  if (buyer) {
    query.buyer = buyer;
  }

  const totalOrders = await Order.countDocuments(query);

  const orders = await Order.find(query)
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
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: orders.length,
    totalOrders,
    currentPage: page,
    totalPages: Math.ceil(totalOrders / limit),
    data: orders,
  });
});

export const getOrderById = asyncErrorHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
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

  if (!order) {
    return next(new ErrorHandler("Order not found", 404));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getDashboardStats = asyncErrorHandler(async (req, res, next) => {
  const totalUsers = await User.countDocuments({ role: "buyer" });

  const totalSellers = await Seller.countDocuments();
  const activeSellers = await Seller.countDocuments({
    verificationStatus: "approved",
  });

  const totalProducts = await Product.countDocuments();

  const totalCategories = await Category.countDocuments();

  const totalOrders = await Order.countDocuments();

  const revenueData = await Order.aggregate([
    {
      $match: { status: "delivered" },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalRevenue = revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

  const orderStatusStats = await Order.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const statusSummary = {};
  orderStatusStats.forEach((item) => {
    statusSummary[item._id] = item.count;
  });

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalSellers,
      activeSellers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      orderStatus: statusSummary,
    },
  });
});
