import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import categoryService from "../services/categoryService.js";

export const createCategory = asyncErrorHandler(
  async (req, res) => {
    const category =
      await categoryService.createCategory(
        req.body.name,
        req.body.description,
        req.file,
      );

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  },
);

export const getAllCategories = asyncErrorHandler(
  async (req, res) => {
    const categories =
      await categoryService.getAllCategories();

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  },
);

export const getCategoryById = asyncErrorHandler(
  async (req, res) => {
    const category =
      await categoryService.getCategoryById(
        req.params.id,
      );

    res.status(200).json({
      success: true,
      data: category,
    });
  },
);

export const updateCategory = asyncErrorHandler(
  async (req, res) => {
    const category =
      await categoryService.updateCategory(
        req.params.id,
        req.body.name,
        req.body.description,
        req.file,
      );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  },
);

export const deleteCategory = asyncErrorHandler(
  async (req, res) => {
    await categoryService.deleteCategory(
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  },
);

export const getMyCategories = asyncErrorHandler(
  async (req, res) => {
    const categories =
      await categoryService.getMyCategories(req.user);

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  },
);