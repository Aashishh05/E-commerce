import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { transporter } from "../config/nodemailer.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import fs from "fs";
import Seller from "../models/sellerModel.js";

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, shopName, specialization } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    let images = {};
    if (req.file) {
      const uploaded = await UploadToCloudinary(req.file.path, "E-commerce");
      images = {
        url: uploaded.url,
        public_id: uploaded.public_id,
        path: uploaded.path,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = await User.create({
      name,
      email,
      images,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
      role: role || "buyer",
    });

    // If seller, create seller profile
    if (role === "seller") {
      await Seller.create({
        user: user._id,
        shopName: shopName || `${name}'s Shop`,
        specialization: specialization || "General",
      });
    }

    await transporter.sendMail({
      from: process.env.SMTP_SENDER,
      to: email,
      subject: "Verify your account — OTP",
      html: `
        <h2>Welcome to the platform!</h2>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your account before logging in",
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account has been deactivated. Contact admin.",
      });
    }

    if (user.role === "seller") {
      const seller = await Seller.findOne({ user: user._id });
      if (seller && seller.verificationStatus === "blocked") {
        return res.status(403).json({
          success: false,
          message: "Your seller account has been blocked. Contact admin.",
        });
      }
    }

    // Generate token and set cookie
    const token = generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
        token,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

// Get current user
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};

// Update profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, address },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Handle profile image update
    if (req.file) {
      if (user.images?.public_id) {
        await deleteCloudinaryImage(user.images.public_id);
      }

      if (user.images?.path && fs.existsSync(user.images.path)) {
        fs.unlinkSync(user.images.path);
      }

      const uploaded = await UploadToCloudinary(req.file.path, "E-commerce");
      user.images = {
        url: uploaded.url,
        public_id: uploaded.public_id,
        path: uploaded.path,
      };

      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.otp || !user.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new one.",
      });
    }

    if (Date.now() > user.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Mark user as verified and clear OTP
    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

// Forgot password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate and save OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send OTP email
    await transporter.sendMail({
      from: process.env.SMTP_SENDER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check OTP expiry first, then validate
    if (Date.now() > user.otpExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash new password and clear OTP
    user.password = await bcrypt.hash(password, 10);
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Password reset failed",
      error: error.message,
    });
  }
};