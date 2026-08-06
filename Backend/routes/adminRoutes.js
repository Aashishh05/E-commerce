import express from "express";
import {
  getAllUsers,
  getUserById,
  toggleUserStatus,
  deleteUser,
  getAllSellers,
  getSellerById,
  verifySeller,
  blockSeller,
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllProducts,
  deleteProduct,
  getAllOrders,
  getOrderById,
  getDashboardStats,
} from "../controller/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();



router.use(protect);
router.use(authorize("admin"));

//  DASHBOARD

router.get("/dashboard", getDashboardStats);

//USER MANAGEMENT

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/toggle-user/:id", toggleUserStatus);
router.delete("/delete-user/:id", deleteUser);

// SELLER MANAGEMENT

router.get("/sellers", getAllSellers);
router.get("/sellers/:id", getSellerById);
router.put("/sellers/:id", verifySeller);
router.put("/block-seller/:id", blockSeller);

//CATEGORY MANAGEMENT ROUTES

router.get("/categories/getall", getAllCategories);
router.get("/categories/get/:id", getCategoryById);
router.post("/categories/create", upload.single("image"), createCategory);
router.patch("/categories/update/:id", upload.single("image"), updateCategory);
router.delete("/categories/delete/:id", deleteCategory);

// PRODUCT MANAGEMENT ROUTES

router.get("/products", getAllProducts);
router.delete("/products/:productId", deleteProduct);

// ORDER MANAGEMENT ROUTES

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);


export default router;
