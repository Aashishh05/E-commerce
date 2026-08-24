import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import productService from "../services/productService.js";

export const createProduct = asyncErrorHandler(
  async (req, res) => {
    const product =
      await productService.createProduct(
        req.user,
        req.body,
        req.files,
      );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  },
);

export const getAllProducts = asyncErrorHandler(
  async (req, res) => {
    const result =
      await productService.getAllProducts(
        req.query,
      );

    res.status(200).json({
      success: true,
      data: result.products,
      pagination: result.pagination,
    });
  },
);

export const getProductById = asyncErrorHandler(
  async (req, res) => {
    const product =
      await productService.getProductById(
        req.params.id,
      );

    res.status(200).json({
      success: true,
      data: product,
    });
  },
);

export const updateProduct = asyncErrorHandler(
  async (req, res) => {
    const product =
      await productService.updateProduct(
        req.user,
        req.params.id,
        req.body,
        req.files,
      );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  },
);

export const deleteProduct = asyncErrorHandler(
  async (req, res) => {
    await productService.deleteProduct(
      req.user,
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  },
);

export const getMyProducts = asyncErrorHandler(
  async (req, res) => {
    const products =
      await productService.getMyProducts(
        req.user,
      );

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  },
);