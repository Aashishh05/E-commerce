import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controller/cartController.js";
import { authorize, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, authorize("buyer"), addToCart);
router.get("/get", protect, authorize("buyer"), getCart);
router.put("/update/:id", protect, authorize("buyer"), updateCartItem);
router.delete("/remove/:id", protect, authorize("buyer"), removeFromCart);
router.delete("/clear", protect, authorize("buyer"), clearCart);

export default router;
