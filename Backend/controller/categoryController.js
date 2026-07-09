import Category from "../models/categoriesModel.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import fs from "fs";

export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const trimmedName = name.trim();

    const existingCategory = await Category.findOne({
      name: {
        $regex: new RegExp(`^${trimmedName}$`, "i"),
      },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category with this name already exists",
      });
    }

    let image = {};

    if (req.file) {
      const uploadImage = await UploadToCloudinary(req.file.path, "E-commerce");

      image = {
        url: uploadImage.url,
        public_id: uploadImage.public_id,
        path: uploadImage.path,
      };

      if (fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, () => {});
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name && !description && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
    }

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
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
        return res.status(400).json({
          success: false,
          message: "Another category with this name already exists",
        });
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

      const uploadImage = await UploadToCloudinary(req.file.path, "E-commerce");

      category.image = {
        url: uploadImage.url,
        public_id: uploadImage.public_id,
        path: uploadImage.path,
      };

      if (fs.existsSync(req.file.path)) {
        fs.unlink(req.file.path, () => {});
      }
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (category.image?.public_id) {
      await deleteCloudinaryImage(category.image.public_id);
    }

    await category.deleteOne();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });
  }
};
