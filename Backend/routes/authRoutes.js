import express from "express";
import {
  forgotPassword,
  getUser,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  updateProfile,
  verifyOTP,
} from "../controller/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { body } from "express-validator";
import { validate } from "../middleware/validate.js";

const router = express.Router();

// Validation rules
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Valid email is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .isIn(["buyer", "seller"])
    .withMessage("Role must be buyer or seller"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/register", registerValidation, validate, registerUser);
router.post("/login", loginValidation, validate, loginUser);
router.post("/logout", logout);
router.get("/me", protect, getUser);
router.put("/profile", protect, updateProfile);

router.post("/verify-otp", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
