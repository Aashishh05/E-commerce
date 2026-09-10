import express from "express";
import {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
  getWishlistIds,
} from "../controller/wishlistController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(authorize("buyer"));

router.get("/get", getWishlist);
router.get("/ids", getWishlistIds);
router.post("/toggle", toggleWishlist);
router.delete("/remove/:productId", removeFromWishlist);

export default router;
