import express from "express";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controller/categoryController";
import { authorize, protect } from "../middleware/authMiddleware";

const router = express.Router();

//public routes
router.get("/getall", getAllCategories);
router.get("/get/:id", getCategoryById);

//seller routes
router.post("/create", protect, authorize("seller"), createCategory);
router.put("/update/:id", protect, authorize("seller"), updateCategory);
router.delete("/delete/:id", protect, authorize("seller"), deleteCategory);

export default router;
