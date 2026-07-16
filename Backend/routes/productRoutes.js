import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controller/productController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router();

//Public routes
router.get("/getall", getAllProducts);
router.get("/get/:id", getProductById);

//Seller routes
router.post("/create", protect, authorize("seller"),upload.single("image"), createProduct);
router.put("/update/:id", protect, authorize("seller"),upload.single("image"), updateProduct);
router.delete("/delete/:id", protect, authorize("seller"), deleteProduct);

export default router;
