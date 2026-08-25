import categoryRepository from "../repositories/categoryRepository.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import redisClient from "../config/redis.js";

class CategoryService {
  validateCategoryName(name, message) {
    if (!name?.trim()) {
      throw new ErrorHandler(message, 400);
    }

    return name.trim();
  }

  checkSeller(user) {
    if (user.role !== "seller") {
      throw new ErrorHandler("Only sellers can access this", 403);
    }
  }

  async createCategory(name, description, file, user) {
    this.checkSeller(user);

    const trimmedName = this.validateCategoryName(
      name,
      "Category name is required",
    );

    const existingCategory =
      await categoryRepository.findCategoryByName(trimmedName);

    if (existingCategory) {
      throw new ErrorHandler("Category with this name already exists", 400);
    }

    const seller = await categoryRepository.findSellerByUser(user._id);

    if (!seller) {
      throw new ErrorHandler("Seller profile not found", 404);
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
      };
    }

    const category = await categoryRepository.createCategory({
      name: trimmedName,
      description: description?.trim(),
      image,
      seller: seller._id,
    });

    await redisClient.del("categories");
    await redisClient.del(`categories:seller:${seller._id}`);

    return category;
  }

  async getAllCategories() {
    const cacheKey = "categories";

    const cachedCategories = await redisClient.get(cacheKey);

    if (cachedCategories) {
      return JSON.parse(cachedCategories);
    }

    const categories = await categoryRepository.findAllCategories();

    await redisClient.set(cacheKey, JSON.stringify(categories), {
      EX: 300,
    });

    return categories;
  }

  async getCategoryById(categoryId) {
    const cacheKey = `category:${categoryId}`;

    const cachedCategory = await redisClient.get(cacheKey);

    if (cachedCategory) {
      return JSON.parse(cachedCategory);
    }

    const category = await categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(category), {
      EX: 300,
    });

    return category;
  }

  async updateCategory(categoryId, name, description, file) {
    if (name === undefined && description === undefined && !file) {
      throw new ErrorHandler("Provide at least one field to update", 400);
    }

    const category = await categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    if (name !== undefined) {
      const trimmedName = this.validateCategoryName(
        name,
        "Category name cannot be empty",
      );

      const existingCategory = await categoryRepository.findCategoryByName(
        trimmedName,
        categoryId,
      );

      if (existingCategory) {
        throw new ErrorHandler(
          "Another category with this name already exists",
          400,
        );
      }

      category.name = trimmedName;
    }

    if (description !== undefined) {
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
      };
    }

    const updatedCategory = await categoryRepository.saveCategory(category);

    await redisClient.del(`category:${categoryId}`);
    await redisClient.del("categories");

    if (category.seller) {
      await redisClient.del(`categories:seller:${category.seller}`);
    }

    return updatedCategory;
  }

  async deleteCategory(categoryId) {
    const category = await categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new ErrorHandler("Category not found", 404);
    }

    if (category.image?.public_id) {
      await deleteCloudinaryImage(category.image.public_id);
    }

    await categoryRepository.deleteCategory(category);

    await redisClient.del(`category:${categoryId}`);
    await redisClient.del("categories");

    if (category.seller) {
      await redisClient.del(`categories:seller:${category.seller}`);
    }
  }

  async getMyCategories(user) {
    this.checkSeller(user);

    const seller = await categoryRepository.findSellerByUser(user._id);

    if (!seller) {
      throw new ErrorHandler("Seller profile not found", 404);
    }

    const cacheKey = `categories:seller:${seller._id}`;

    const cachedCategories = await redisClient.get(cacheKey);

    if (cachedCategories) {
      return JSON.parse(cachedCategories);
    }

    const categories = await categoryRepository.findCategoriesBySeller(
      seller._id,
    );

    await redisClient.set(cacheKey, JSON.stringify(categories), {
      EX: 300,
    });

    return categories;
  }
}

export default new CategoryService();
