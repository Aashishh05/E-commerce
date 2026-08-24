import mongoose from "mongoose";
import fs from "fs";

import adminRepository from "../repositories/adminRepository.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class AdminService {
  // ==================== USERS ====================

  async getAllUsers(queryParams) {
    const page = Math.max(Number(queryParams.page) || 1, 1);
    const limit = Math.min(Number(queryParams.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const search = queryParams.search || "";
    const role = queryParams.role;

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

    const users = await adminRepository.findAllUsers(
      filter,
      skip,
      limit
    );

    const totalUsers = await adminRepository.countUsers(filter);

    return {
      count: users.length,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      data: { users },
    };
  }

  async getUserById(id) {
    const user = await adminRepository.findUserById(id);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    return user;
  }

  async toggleUserStatus(id) {
    const user = await adminRepository.findUserByIdWithPassword(id);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (user.role === "admin") {
      throw new ErrorHandler(
        "Admin account cannot be blocked",
        403
      );
    }

    user.isActive = !user.isActive;

    await adminRepository.saveUser(user);

    return user;
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
      throw new ErrorHandler(
        "Admin account cannot be deleted",
        403
      );
    }

    if (user._id.toString() === currentUserId.toString()) {
      throw new ErrorHandler(
        "You cannot delete your own account",
        403
      );
    }

    if (user.role === "seller") {
      await adminRepository.deleteProductsBySeller(user._id);
    }

    await adminRepository.deleteReviewsByUser(user._id);
    await adminRepository.deleteCartByUser(user._id);
    await adminRepository.deleteOrdersByUser(user._id);
    await adminRepository.deleteUserById(user._id);
  }

  // ==================== SELLERS ====================

  async getAllSellers(queryParams) {
    const page = Math.max(
      parseInt(queryParams.page) || 1,
      1
    );

    const limit = Math.max(
      parseInt(queryParams.limit) || 10,
      1
    );

    const skip = (page - 1) * limit;

    const total = await adminRepository.countSellers();

    const sellers = await adminRepository.findAllSellers(
      skip,
      limit
    );

    return {
      count: sellers.length,
      total_seller: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: { sellers },
    };
  }

  async getSellerById(id) {
    const seller = await adminRepository.findSellerById(id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    return seller;
  }

  async verifySeller(id, status) {
    if (!status) {
      throw new ErrorHandler("Status is required", 400);
    }

    const normalizedStatus = status.trim().toLowerCase();

    if (
      !["approved", "pending", "rejected"].includes(
        normalizedStatus
      )
    ) {
      throw new ErrorHandler(
        "Status must be approved, pending, or rejected",
        400
      );
    }

    const seller =
      await adminRepository.findSellerByIdWithoutPopulate(id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    seller.verificationStatus = normalizedStatus;
    seller.isVerified = normalizedStatus === "approved";

    await adminRepository.saveSeller(seller);

    return {
      seller,
      status: normalizedStatus,
    };
  }

  async blockSeller(id) {
    const seller =
      await adminRepository.findSellerByIdWithoutPopulate(id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    if (seller.verificationStatus === "blocked") {
      seller.verificationStatus = "approved";
    } else {
      seller.verificationStatus = "blocked";
    }

    await adminRepository.saveSeller(seller);

    return seller;
  }

  // ==================== CATEGORIES ====================

  async createCategory(name, description, file) {
    if (!name?.trim()) {
      throw new ErrorHandler(
        "Category name is required",
        400
      );
    }

    const trimmedName = name.trim();

    const existingCategory =
      await adminRepository.findCategoryByName(
        new RegExp(`^${trimmedName}$`, "i")
      );

    if (existingCategory) {
      throw new ErrorHandler(
        "Category with this name already exists",
        400
      );
    }

    let image = {};

    if (file) {
      const uploadImage = await UploadToCloudinary(
        file.buffer,
        "E-commerce/Categories"
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

    return await adminRepository.createCategory({
      name: trimmedName,
      description: description?.trim(),
      image,
    });
  }

  async getAllCategories(queryParams) {
    const page = Math.max(
      Number(queryParams.page) || 1,
      1
    );

    const limit = Math.min(
      Number(queryParams.limit) || 10,
      100
    );

    const skip = (page - 1) * limit;
    const search = queryParams.search || "";

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

    const totalCategories =
      await adminRepository.countCategories(filter);

    const categories =
      await adminRepository.findAllCategories(
        filter,
        skip,
        limit
      );

    return {
      count: categories.length,
      totalCategories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
      data: categories,
    };
  }

  async getCategoryById(id) {
    const category =
      await adminRepository.findCategoryById(id);

    if (!category) {
      throw new ErrorHandler(
        "Category not found",
        404
      );
    }

    return category;
  }

  async updateCategory(id, name, description, file) {
    if (!name && !description && !file) {
      throw new ErrorHandler(
        "Provide at least one field to update",
        400
      );
    }

    const category =
      await adminRepository.findCategoryById(id);

    if (!category) {
      throw new ErrorHandler(
        "Category not found",
        404
      );
    }

    if (name) {
      const trimmedName = name.trim();

      const existingCategory =
        await adminRepository.findCategoryByNameExceptId(
          new RegExp(`^${trimmedName}$`, "i"),
          id
        );

      if (existingCategory) {
        throw new ErrorHandler(
          "Another category with this name already exists",
          400
        );
      }

      category.name = trimmedName;
    }

    if (description) {
      category.description = description.trim();
    }

    if (file) {
      if (category.image?.public_id) {
        await deleteCloudinaryImage(
          category.image.public_id
        );
      }

      const uploadImage = await UploadToCloudinary(
        file.buffer,
        "E-commerce/Categories"
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

    return await adminRepository.saveCategory(category);
  }

  async deleteCategory(id) {
    const category =
      await adminRepository.findCategoryById(id);

    if (!category) {
      throw new ErrorHandler(
        "Category not found",
        404
      );
    }

    if (category.image?.public_id) {
      await deleteCloudinaryImage(
        category.image.public_id
      );
    }

    await adminRepository.deleteCategory(category);
  }

  // ==================== PRODUCTS ====================

  async getAllProducts(queryParams) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;

    const search = queryParams.search || "";
    const category = queryParams.category;
    const seller = queryParams.seller;
    const status = queryParams.status;

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

    const totalProducts =
      await adminRepository.countProducts(query);

    const products =
      await adminRepository.findAllProducts(
        query,
        (page - 1) * limit,
        limit
      );

    return {
      count: products.length,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(
        totalProducts / limit
      ),
      data: products,
    };
  }

  async deleteProduct(id) {
    const product =
      await adminRepository.findProductById(id);

    if (!product) {
      throw new ErrorHandler(
        "Product not found",
        404
      );
    }

    await adminRepository.deleteProductReviews(
      product._id
    );

    await adminRepository.removeProductFromCarts(
      product._id
    );

    await adminRepository.deleteProductById(
      product._id
    );
  }

  // ==================== ORDERS ====================

  async getAllOrders(queryParams) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;

    const status = queryParams.status;
    const paymentStatus = queryParams.paymentStatus;
    const buyer = queryParams.buyer;

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

    const totalOrders =
      await adminRepository.countOrders(query);

    const orders =
      await adminRepository.findAllOrders(
        query,
        (page - 1) * limit,
        limit
      );

    return {
      count: orders.length,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(
        totalOrders / limit
      ),
      data: orders,
    };
  }

  async getOrderById(id) {
    const order =
      await adminRepository.findOrderById(id);

    if (!order) {
      throw new ErrorHandler(
        "Order not found",
        404
      );
    }

    return order;
  }

  // ==================== DASHBOARD ====================

  async getDashboardStats() {
    const totalUsers =
      await adminRepository.countBuyerUsers();

    const totalSellers =
      await adminRepository.countSellers();

    const activeSellers =
      await adminRepository.countActiveSellers();

    const totalProducts =
      await adminRepository.countProductsForDashboard();

    const totalCategories =
      await adminRepository.countCategoriesForDashboard();

    const totalOrders =
      await adminRepository.countOrdersForDashboard();

    const revenueData =
      await adminRepository.getRevenueData();

    const totalRevenue =
      revenueData.length > 0
        ? revenueData[0].totalRevenue
        : 0;

    const orderStatusStats =
      await adminRepository.getOrderStatusStats();

    const statusSummary = {};

    orderStatusStats.forEach((item) => {
      statusSummary[item._id] = item.count;
    });

    return {
      totalUsers,
      totalSellers,
      activeSellers,
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      orderStatus: statusSummary,
    };
  }
}

export default new AdminService();