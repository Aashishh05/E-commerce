import express from "express";
import {
  createReview,
  deleteReview,
  getMyReviews,
  getProductReviews,
  updateReview,
} from "../controller/reviewController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("buyer"));

router.post("/create", createReview);
router.put("/update/:id", updateReview);
router.delete("/delete/:id", deleteReview);

export default router;
