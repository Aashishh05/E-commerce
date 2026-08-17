import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Category from "../models/categoriesModel.js";
import Seller from "../models/sellerModel.js";

export const createCategory = asyncErrorHandler(async (req, res, next) => {
  const { name, description } = req.body;

  if (!name?.trim()) {
    return next(new ErrorHandler("Category name is required", 400));
  }

  const trimmedName = name.trim();

  const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const existingCategory = await Category.findOne({
    name: {
      $regex: new RegExp(`^${escapedName}$`, "i"),
    },
  });

  if (existingCategory) {
    return next(
      new ErrorHandler("Category with this name already exists", 400),
    );
  }

  let image = {};

  if (req.file) {
    const uploadImage = await UploadToCloudinary(req.file.buffer, "Blog");
    console.log(uploadImage);

    image = {
      url: uploadImage.url,
      public_id: uploadImage.public_id,
    };
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
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: categories.length,
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

  if (name === undefined && description === undefined && !req.file) {
    return next(new ErrorHandler("Provide at least one field to update", 400));
  }

  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ErrorHandler("Category not found", 404));
  }

  if (name !== undefined) {
    if (!name.trim()) {
      return next(new ErrorHandler("Category name cannot be empty", 400));
    }

    const trimmedName = name.trim();

    const escapedName = trimmedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const existingCategory = await Category.findOne({
      name: {
        $regex: new RegExp(`^${escapedName}$`, "i"),
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

  if (description !== undefined) {
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
    };
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

export const getMyCategories = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "seller") {
    return next(new ErrorHandler("Only sellers can access this", 403));
  }

  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) {
    return next(new ErrorHandler("Seller profile not found", 404));
  }

  const categories = await Category.find({ seller: seller._id }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});
