import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getSellerOrders,
  updateOrderStatus,
} from "../controller/orderController";
import { protect, authorize } from "../middleware/authMiddleware";

const router = express.Router();

router.use(protect);

//buyer routes
router.post("/create", authorize("buyer"), createOrder);
router.get("/get", authorize("buyer"), getMyOrders);
router.get("/get/:id", authorize("buyer"), getOrderById);
router.delete("/cancel/:id", authorize("buyer"), cancelOrder);

//seller routes
router.get("/seller", authorize("seller"), getSellerOrders);
router.put("/update/:id", authorize("seller"), updateOrderStatus);

export default router;
