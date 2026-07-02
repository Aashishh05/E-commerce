import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controller/productController";
import { authorize, protect } from "../middleware/authMiddleware";

const router = express.Router();

//Public routes
router.get("/getall", getAllProducts);
router.get("/get/:id", getProductById);

//Seller routes
router.post("/create", protect, authorize("seller"), createProduct);
router.put("/update/:id", protect, authorize("seller"), updateProduct);
router.delete("/delete/:id", protect, authorize("seller"), deleteProduct);

export default router;
