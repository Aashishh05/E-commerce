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
  getAllProducts,
  deleteProduct,
  getAllOrders,
  getOrderById,
  getDashboardStats,
} from "../controller/adminController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";



const router = express.Router();

// Protect every admin route

router.use(protect)
router.use(authorize("admin"));

router.get("/dashboard", getDashboardStats);

//   User Management

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id/status", toggleUserStatus);
router.delete("/users/:id", deleteUser);

//   Seller Management

router.get("/sellers", getAllSellers);
router.get("/sellers/:id", getSellerById);
router.put("/sellers/:id", verifySeller);
router.put("/block-seller/:id", blockSeller);

//   Product Management

router.get("/products", getAllProducts);
router.delete("/products/:productId", deleteProduct);

//   Order Management

router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderById);

export default router;
