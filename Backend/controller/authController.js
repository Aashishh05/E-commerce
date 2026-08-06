import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { transporter } from "../config/nodemailer.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import fs from "fs";
import Seller from "../models/sellerModel.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";



export const registerUser = asyncErrorHandler(async (req, res, next) => {
  const { name, email, password, role, shopName, specialization } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
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

  const user = await User.create({
    name,
    email,
    images,
    password: hashedPassword,
    otp,
    otpExpire: Date.now() + 10 * 60 * 1000,
    role: role || "buyer",
  });

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
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(201).json({
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
});

export const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required", 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  if (!user.isVerified) {
    return next(
      new ErrorHandler("Please verify your account before logging in", 403),
    );
  }

  if (!user.isActive) {
    return next(
      new ErrorHandler("Account has been deactivated. Contact admin.", 403),
    );
  }

  if (user.role === "seller") {
    const seller = await Seller.findOne({ user: user._id });
    if (seller && seller.verificationStatus === "blocked") {
      return next(
        new ErrorHandler(
          "Your seller account has been blocked. Contact admin.",
          403,
        ),
      );
    }
  }

  const token = generateToken(user._id);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
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
});

export const logout = asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const getUser = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    data: { user },
  });
});

export const updateProfile = asyncErrorHandler(async (req, res, next) => {
  const { name, phone, address } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { name, phone, address },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

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

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: { user },
  });
});

export const verifyOTP = asyncErrorHandler(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (!user.otp || !user.otpExpire) {
    return next(
      new ErrorHandler("No OTP found. Please request a new one.", 400),
    );
  }

  if (Date.now() > user.otpExpire) {
    return next(
      new ErrorHandler("OTP has expired. Please request a new one.", 400),
    );
  }

  if (user.otp !== otp) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

export const forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpire = Date.now() + 10 * 60 * 1000;
  await user.save();

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

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
});

export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const { email, otp, password } = req.body;

  if (!email || !otp || !password) {
    return next(
      new ErrorHandler("Email, OTP and new password are required", 400),
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  if (Date.now() > user.otpExpire) {
    return next(
      new ErrorHandler("OTP has expired. Please request a new one.", 400),
    );
  }

  if (String(user.otp) !== String(otp)) {
    return next(new ErrorHandler("Invalid OTP", 400));
  }

  user.password = await bcrypt.hash(password, 10);
  user.otp = null;
  user.otpExpire = null;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
