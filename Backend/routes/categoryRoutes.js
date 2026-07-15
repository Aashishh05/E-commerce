import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controller/categoryController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"

const router = express.Router();

//public routes
router.get("/getall", getAllCategories);
router.get("/get/:id", getCategoryById);

//seller routes
router.post("/create", protect, authorize("seller"),upload.single("image"), createCategory);
router.put("/update/:id", protect, authorize("seller"),upload.single("image"), updateCategory);
router.delete("/delete/:id", protect, authorize("seller"), deleteCategory);

export default router;
