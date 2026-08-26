import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import adminService from "../services/adminService.js";

export const getAllUsers = asyncErrorHandler(async (req, res) => {
  const result = await adminService.getAllUsers(req.query);

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    ...result,
  });
});

export const getUserById = asyncErrorHandler(async (req, res) => {
  const user = await adminService.getUserById(req.params.id);

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    data: { user },
  });
});

export const toggleUserStatus = asyncErrorHandler(async (req, res) => {
  const user = await adminService.toggleUserStatus(req.params.id);

  res.status(200).json({
    success: true,
    message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,
    data: user,
  });
});

export const deleteUser = asyncErrorHandler(async (req, res) => {
  await adminService.deleteUser(req.params.id, req.user.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const getAllSellers = asyncErrorHandler(async (req, res) => {
  const result = await adminService.getAllSellers(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getSellerById = asyncErrorHandler(async (req, res) => {
  const seller = await adminService.getSellerById(req.params.id);

  res.status(200).json({
    success: true,
    data: seller,
  });
});

export const verifySeller = asyncErrorHandler(async (req, res) => {
  const result = await adminService.verifySeller(
    req.params.id,
    req.body?.status,
  );

  res.status(200).json({
    success: true,
    message: `Seller ${result.status} successfully`,
    data: result.seller,
  });
});

export const blockSeller = asyncErrorHandler(async (req, res) => {
  const seller = await adminService.blockSeller(req.params.id);

  res.status(200).json({
    success: true,
    message: `Seller ${
      seller.verificationStatus === "blocked" ? "blocked" : "unblocked"
    } successfully`,
    data: { seller },
  });
});

export const createCategory = asyncErrorHandler(async (req, res) => {
  const category = await adminService.createCategory(
    req.body.name,
    req.body.description,
    req.file,
  );

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

export const getAllCategories = asyncErrorHandler(async (req, res) => {
  const result = await adminService.getAllCategories(req.query);

  res.status(200).json({
    success: true,
    message: "Categories fetched successfully",
    ...result,
  });
});

export const getCategoryById = asyncErrorHandler(async (req, res) => {
  const category = await adminService.getCategoryById(req.params.id);

  res.status(200).json({
    success: true,
    data: category,
  });
});

export const updateCategory = asyncErrorHandler(async (req, res) => {
  const category = await adminService.updateCategory(
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
});

export const deleteCategory = asyncErrorHandler(async (req, res) => {
  await adminService.deleteCategory(req.params.id);

  res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});

export const getAllProducts = asyncErrorHandler(async (req, res) => {
  const result = await adminService.getAllProducts(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const deleteProduct = asyncErrorHandler(async (req, res) => {
  await adminService.deleteProduct(req.params.productId);

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

export const getAllOrders = asyncErrorHandler(async (req, res) => {
  const result = await adminService.getAllOrders(req.query);

  res.status(200).json({
    success: true,
    ...result,
  });
});

export const getOrderById = asyncErrorHandler(async (req, res) => {
  const order = await adminService.getOrderById(req.params.id);

  res.status(200).json({
    success: true,
    data: order,
  });
});

export const getDashboardStats = asyncErrorHandler(async (req, res) => {
  const stats = await adminService.getDashboardStats();

  res.status(200).json({
    success: true,
    data: stats,
  });
});
