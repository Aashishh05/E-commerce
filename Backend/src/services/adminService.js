import mongoose from "mongoose";
import fs from "fs";
import adminRepository from "../repositories/adminRepository.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import redisClient from "../config/redis.js";

class AdminService {
  async deleteCacheByPattern(pattern) {
    for await (const key of redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100,
    })) {
      await redisClient.del(key);
    }
  }

  async getAllUsers(queryParams) {
    const page = Math.max(Number(queryParams.page) || 1, 1);
    const limit = Math.min(Number(queryParams.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const search = queryParams.search || "";
    const role = queryParams.role;

    const cacheKey = `admin:users:${JSON.stringify({
      page,
      limit,
      search,
      role,
    })}`;

    const cachedUsers = await redisClient.get(cacheKey);

    if (cachedUsers) {
      return JSON.parse(cachedUsers);
    }

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

    const users = await adminRepository.findAllUsers(filter, skip, limit);

    const totalUsers = await adminRepository.countUsers(filter);

    const result = {
      count: users.length,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      data: { users },
    };

    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 300,
    });

    return result;
  }

  async getUserById(id) {
    const cacheKey = `admin:user:${id}`;

    const cachedUser = await redisClient.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await adminRepository.findUserById(id);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(user), {
      EX: 300,
    });

    return user;
  }

  async toggleUserStatus(id) {
    const user = await adminRepository.findUserByIdWithPassword(id);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (user.role === "admin") {
      throw new ErrorHandler("Admin account cannot be blocked", 403);
    }

    user.isActive = !user.isActive;

    const updatedUser = await adminRepository.saveUser(user);

    await redisClient.del(`admin:user:${id}`);
    await this.deleteCacheByPattern("admin:users:*");

    return updatedUser;
  }

  async deleteUser(id, currentUserId) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ErrorHandler("Invalid user ID", 400);
    }

    const user = await adminRepository.findUserByIdWithPassword(id);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (user.role === "admin") {
      throw new ErrorHandler("Admin account cannot be deleted", 403);
    }

    if (user._id.toString() === currentUserId.toString()) {
      throw new ErrorHandler("You cannot delete your own account", 403);
    }

    if (user.role === "seller") {
      await adminRepository.deleteProductsBySeller(user._id);
    }

    await adminRepository.deleteReviewsByUser(user._id);
    await adminRepository.deleteCartByUser(user._id);
    await adminRepository.deleteOrdersByUser(user._id);
    await adminRepository.deleteUserById(user._id);

    await redisClient.del(`admin:user:${id}`);
    await this.deleteCacheByPattern("admin:users:*");

    await this.deleteCacheByPattern("admin:sellers:*");
    await this.deleteCacheByPattern("admin:products:*");
    await this.deleteCacheByPattern("admin:orders:*");
    await redisClient.del("admin:dashboard");

    if (user.role === "seller") {
      await this.deleteCacheByPattern("products*");
      await this.deleteCacheByPattern("product:*");
      await this.deleteCacheByPattern("categories:seller:*");
    }
  }

  async getAllSellers(queryParams) {
    const page = Math.max(parseInt(queryParams.page) || 1, 1);

    const limit = Math.max(parseInt(queryParams.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const cacheKey = `admin:sellers:${JSON.stringify({
      page,
      limit,
    })}`;

    const cachedSellers = await redisClient.get(cacheKey);

    if (cachedSellers) {
      return JSON.parse(cachedSellers);
    }

    const total = await adminRepository.countSellers();

    const sellers = await adminRepository.findAllSellers(skip, limit);

    const result = {
      count: sellers.length,
      total_seller: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: { sellers },
    };

    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 300,
    });

    return result;
  }

  async getSellerById(id) {
    const cacheKey = `admin:seller:${id}`;

    const cachedSeller = await redisClient.get(cacheKey);

    if (cachedSeller) {
      return JSON.parse(cachedSeller);
    }

    const seller = await adminRepository.findSellerById(id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(seller), {
      EX: 300,
    });

    return seller;
  }

  async verifySeller(id, status) {
    if (!status) {
      throw new ErrorHandler("Status is required", 400);
    }

    const normalizedStatus = status.trim().toLowerCase();

    if (!["approved", "pending", "rejected"].includes(normalizedStatus)) {
      throw new ErrorHandler(
        "Status must be approved, pending, or rejected",
        400,
      );
    }

    const seller = await adminRepository.findSellerByIdWithoutPopulate(id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    seller.verificationStatus = normalizedStatus;
    seller.isVerified = normalizedStatus === "approved";

    await adminRepository.saveSeller(seller);

    await redisClient.del(`admin:seller:${id}`);
    await this.deleteCacheByPattern("admin:sellers:*");

    await redisClient.del("admin:dashboard");

    return {
      seller,
      status: normalizedStatus,
    };
  }

  async blockSeller(id) {
    const seller = await adminRepository.findSellerByIdWithoutPopulate(id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    if (seller.verificationStatus === "blocked") {
      seller.verificationStatus = "approved";
    } else {
      seller.verificationStatus = "blocked";
    }

    await adminRepository.saveSeller(seller);

    await redisClient.del(`admin:seller:${id}`);
    await this.deleteCacheByPattern("admin:sellers:*");

    await redisClient.del("admin:dashboard");

    return seller;
  }

  async createCategory(name, description, file) {
    if (!name?.trim()) {
      throw new ErrorHandler("Category name is required", 400);
    }

    const trimmedName = name.trim();

    const existingCategory = await adminRepository.findCategoryByName(
      new RegExp(`^${trimmedName}$`, "i"),
    );

    if (existingCategory) {
      throw new ErrorHandler("Category with this name already exists", 400);
    }

    let image = {};

    if (file) {
      const uploadImage = await UploadToCloudinary(
        file.buffer,
        "E-commerce/Categories",
      );

      image = {
        url: uploadImage.url,
        public_id: uploadImage.public_id,
        path: uploadImage.path,
      };

      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    const category = await adminRepository.createCategory({
      name: trimmedName,
      description: description?.trim(),
      image,
    });

    await this.deleteCacheByPattern("admin:categories:*");
    await redisClient.del("admin:categories");

    await redisClient.del("categories");

    await redisClient.del("admin:dashboard");

    return category;
  }

  async getAllCategories(queryParams) {
    const page = Math.max(Number(queryParams.page) || 1, 1);

    const limit = Math.min(Number(queryParams.limit) || 10, 100);

    const skip = (page - 1) * limit;
    const search = queryParams.search || "";

    const cacheKey = `admin:categories:${JSON.stringify({
      page,
      limit,
      search,
    })}`;

    const cachedCategories = await redisClient.get(cacheKey);

    if (cachedCategories) {
      return JSON.parse(cachedCategories);
    }

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

    const totalCategories = await adminRepository.countCategories(filter);

    const categories = await adminRepository.findAllCategories(
      filter,
      skip,
      limit,
    );

    const result = {
      count: categories.length,
      totalCategories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
      data: categories,
    };

    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 300,
    });

    return result;
  }

  async getCategoryById(id) {
    const cacheKey = `admin:category:${id}`;

    const cachedCategory = await redisClient.get(cacheKey);

    if (cachedCategory) {
      return JSON.parse(cachedCategory);
    }

    const category = await adminRepository.findCategoryById(id);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(category), {
      EX: 300,
    });

    return category;
  }

  async updateCategory(id, name, description, file) {
    if (!name && !description && !file) {
      throw new ErrorHandler("Provide at least one field to update", 400);
    }

    const category = await adminRepository.findCategoryById(id);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    if (name) {
      const trimmedName = name.trim();

      const existingCategory = await adminRepository.findCategoryByNameExceptId(
        new RegExp(`^${trimmedName}$`, "i"),
        id,
      );

      if (existingCategory) {
        throw new ErrorHandler(
          "Another category with this name already exists",
          400,
        );
      }

      category.name = trimmedName;
    }

    if (description) {
      category.description = description.trim();
    }

    if (file) {
      if (category.image?.public_id) {
        await deleteCloudinaryImage(category.image.public_id);
      }

      const uploadImage = await UploadToCloudinary(
        file.buffer,
        "E-commerce/Categories",
      );

      category.image = {
        url: uploadImage.url,
        public_id: uploadImage.public_id,
        path: uploadImage.path,
      };

      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    const updatedCategory = await adminRepository.saveCategory(category);

    await redisClient.del(`admin:category:${id}`);
    await this.deleteCacheByPattern("admin:categories:*");
    await redisClient.del("admin:categories");

    await redisClient.del("categories");
    await redisClient.del(`category:${id}`);

    if (category.seller) {
      await redisClient.del(`categories:seller:${category.seller}`);
    }

    await redisClient.del("admin:dashboard");

    return updatedCategory;
  }

  async deleteCategory(id) {
    const category = await adminRepository.findCategoryById(id);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    if (category.image?.public_id) {
      await deleteCloudinaryImage(category.image.public_id);
    }

    await adminRepository.deleteCategory(category);

    await redisClient.del(`admin:category:${id}`);
    await this.deleteCacheByPattern("admin:categories:*");
    await redisClient.del("admin:categories");

    await redisClient.del("categories");
    await redisClient.del(`category:${id}`);

    if (category.seller) {
      await redisClient.del(`categories:seller:${category.seller}`);
    }

    await redisClient.del("admin:dashboard");
  }

  async getAllProducts(queryParams) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;

    const search = queryParams.search || "";
    const category = queryParams.category;
    const seller = queryParams.seller;
    const status = queryParams.status;

    const cacheKey = `admin:products:${JSON.stringify({
      page,
      limit,
      search,
      category,
      seller,
      status,
    })}`;

    const cachedProducts = await redisClient.get(cacheKey);

    if (cachedProducts) {
      return JSON.parse(cachedProducts);
    }

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

    const totalProducts = await adminRepository.countProducts(query);

    const products = await adminRepository.findAllProducts(
      query,
      (page - 1) * limit,
      limit,
    );

    const result = {
      count: products.length,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      data: products,
    };

    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 300,
    });

    return result;
  }

  async deleteProduct(id) {
    const product = await adminRepository.findProductById(id);

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    await adminRepository.deleteProductReviews(product._id);

    await adminRepository.removeProductFromCarts(product._id);

    await adminRepository.deleteProductById(product._id);

    await redisClient.del(`product:${id}`);
    await this.deleteCacheByPattern("admin:products:*");
    await this.deleteCacheByPattern("products*");

    await this.deleteCacheByPattern("cart:*");

    await redisClient.del("admin:dashboard");
  }

  async getAllOrders(queryParams) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;

    const status = queryParams.status;
    const paymentStatus = queryParams.paymentStatus;
    const buyer = queryParams.buyer;

    const cacheKey = `admin:orders:${JSON.stringify({
      page,
      limit,
      status,
      paymentStatus,
      buyer,
    })}`;

    const cachedOrders = await redisClient.get(cacheKey);

    if (cachedOrders) {
      return JSON.parse(cachedOrders);
    }

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

    const totalOrders = await adminRepository.countOrders(query);

    const orders = await adminRepository.findAllOrders(
      query,
      (page - 1) * limit,
      limit,
    );

    const result = {
      count: orders.length,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      data: orders,
    };

    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 300,
    });

    return result;
  }

  async getOrderById(id) {
    const cacheKey = `admin:order:${id}`;

    const cachedOrder = await redisClient.get(cacheKey);

    if (cachedOrder) {
      return JSON.parse(cachedOrder);
    }

    const order = await adminRepository.findOrderById(id);

    if (!order) {
      throw new ErrorHandler("Order not found", 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(order), {
      EX: 300,
    });

    return order;
  }

  async getDashboardStats() {
    const cacheKey = "admin:dashboard";

    const cachedDashboard = await redisClient.get(cacheKey);

    if (cachedDashboard) {
      return JSON.parse(cachedDashboard);
    }

    const totalUsers = await adminRepository.countBuyerUsers();

    const totalSellers = await adminRepository.countSellers();

    const activeSellers = await adminRepository.countActiveSellers();

    const totalProducts = await adminRepository.countProductsForDashboard();

    const totalCategories = await adminRepository.countCategoriesForDashboard();

    const totalOrders = await adminRepository.countOrdersForDashboard();

    const revenueData = await adminRepository.getRevenueData();

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    const orderStatusStats = await adminRepository.getOrderStatusStats();

    const statusSummary = {};

    orderStatusStats.forEach((item) => {
      statusSummary[item._id] = item.count;
    });

    const result = {
      totalUsers,
      totalSellers,
      activeSellers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      orderStatus: statusSummary,
    };

    // Dashboard is expensive → cache it
    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 60,
    });

    return result;
  }
}

export default new AdminService();
