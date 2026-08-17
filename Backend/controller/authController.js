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

// ==========================================
// COOKIE OPTIONS
// ==========================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// ==========================================
// REGISTER USER
// ==========================================

export const registerUser = asyncErrorHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    shopName,
    specialization,
  } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  // Check existing user
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new ErrorHandler("User already exists with this email", 400),
    );
  }

  // ==========================================
  // UPLOAD USER IMAGE
  // ==========================================

  let images = {};

  if (req.file) {
    const uploaded = await UploadToCloudinary(
      req.file.path,
      "E-commerce",
    );

    images = {
      url: uploaded.url,
      public_id: uploaded.public_id,
      path: uploaded.path,
    };
  }

  // ==========================================
  // HASH PASSWORD
  // ==========================================

  const hashedPassword = await bcrypt.hash(password, 10);

  // ==========================================
  // GENERATE OTP
  // ==========================================

  const otp = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  // ==========================================
  // CREATE USER
  // ==========================================

  const user = await User.create({
    name,
    email,
    images,
    password: hashedPassword,
    otp,
    otpExpire: Date.now() + 10 * 60 * 1000,
    role: role || "buyer",
  });

  // ==========================================
  // CREATE SELLER
  // ==========================================

  if (role === "seller") {
    await Seller.create({
      user: user._id,
      shopName: shopName || `${name}'s Shop`,
      specialization: specialization || "General",
    });
  }

  // ==========================================
  // SEND OTP EMAIL
  // ==========================================

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

  // ==========================================
  // GENERATE JWT
  // ==========================================

  const token = generateToken(user._id);

  // ==========================================
  // SET COOKIE
  // ==========================================

  res.cookie("token", token, cookieOptions);

  // ==========================================
  // RESPONSE
  // ==========================================

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

// ==========================================
// LOGIN USER
// ==========================================

export const loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // ==========================================
  // VALIDATION
  // ==========================================

  if (!email || !password) {
    return next(
      new ErrorHandler(
        "Email and password are required",
        400,
      ),
    );
  }

  // ==========================================
  // FIND USER
  // ==========================================

  const user = await User.findOne({ email });

  if (!user) {
    return next(
      new ErrorHandler(
        "Invalid email or password",
        401,
      ),
    );
  }

  // ==========================================
  // CHECK PASSWORD
  // ==========================================

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password,
  );

  if (!isPasswordValid) {
    return next(
      new ErrorHandler(
        "Invalid email or password",
        401,
      ),
    );
  }

  // ==========================================
  // CHECK ACTIVE ACCOUNT
  // ==========================================

  if (!user.isActive) {
    return next(
      new ErrorHandler(
        "Account has been deactivated. Contact admin.",
        403,
      ),
    );
  }

  // ==========================================
  // CHECK SELLER
  // ==========================================

  if (user.role === "seller") {
    const seller = await Seller.findOne({
      user: user._id,
    });

    if (
      seller &&
      seller.verificationStatus === "blocked"
    ) {
      return next(
        new ErrorHandler(
          "Your seller account has been blocked. Contact admin.",
          403,
        ),
      );
    }
  }

  // ==========================================
  // GENERATE JWT
  // ==========================================

  const token = generateToken(user._id);

  // ==========================================
  // SET AUTH COOKIE
  // ==========================================

  res.cookie("token", token, cookieOptions);

  // ==========================================
  // RESPONSE
  // ==========================================

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

// ==========================================
// LOGOUT
// ==========================================

export const logout = asyncErrorHandler(
  async (req, res, next) => {
    res.cookie("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      expires: new Date(0),
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  },
);

// ==========================================
// GET CURRENT USER
// ==========================================

export const getUser = asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findById(
      req.user.id,
    ).select("-password");

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  },
);

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = asyncErrorHandler(
  async (req, res, next) => {
    const { name, phone, address } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        phone,
        address,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    // ==========================================
    // UPDATE IMAGE
    // ==========================================

    if (req.file) {
      // Delete old Cloudinary image
      if (user.images?.public_id) {
        await deleteCloudinaryImage(
          user.images.public_id,
        );
      }

      // Delete local image if it exists
      if (
        user.images?.path &&
        fs.existsSync(user.images.path)
      ) {
        fs.unlinkSync(user.images.path);
      }

      // Upload new image
      const uploaded = await UploadToCloudinary(
        req.file.path,
        "E-commerce",
      );

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

      data: {
        user,
      },
    });
  },
);

// ==========================================
// VERIFY OTP
// ==========================================

export const verifyOTP = asyncErrorHandler(
  async (req, res, next) => {
    const { email, otp } = req.body;

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    // ==========================================
    // CHECK OTP
    // ==========================================

    if (!user.otp || !user.otpExpire) {
      return next(
        new ErrorHandler(
          "No OTP found. Please request a new one.",
          400,
        ),
      );
    }

    // ==========================================
    // CHECK EXPIRATION
    // ==========================================

    if (Date.now() > user.otpExpire) {
      return next(
        new ErrorHandler(
          "OTP has expired. Please request a new one.",
          400,
        ),
      );
    }

    // ==========================================
    // CHECK OTP
    // ==========================================

    if (user.otp !== otp) {
      return next(
        new ErrorHandler(
          "Invalid OTP",
          400,
        ),
      );
    }

    // ==========================================
    // VERIFY USER
    // ==========================================

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
    });
  },
);

// ==========================================
// FORGOT PASSWORD
// ==========================================

export const forgotPassword = asyncErrorHandler(
  async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    // ==========================================
    // GENERATE OTP
    // ==========================================

    const otp = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    user.otp = otp;
    user.otpExpire =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    // ==========================================
    // SEND EMAIL
    // ==========================================

    await transporter.sendMail({
      from: process.env.SMTP_SENDER,
      to: user.email,
      subject: "Password Reset OTP",

      html: `
        <h2>Password Reset</h2>

        <p>Your OTP is:</p>

        <h1>${otp}</h1>

        <p>
          This OTP is valid for 10 minutes.
        </p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  },
);

// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = asyncErrorHandler(
  async (req, res, next) => {
    const {
      email,
      otp,
      password,
    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email || !otp || !password) {
      return next(
        new ErrorHandler(
          "Email, OTP and new password are required",
          400,
        ),
      );
    }

    // ==========================================
    // FIND USER
    // ==========================================

    const user = await User.findOne({
      email,
    });

    if (!user) {
      return next(
        new ErrorHandler(
          "User not found",
          404,
        ),
      );
    }

    // ==========================================
    // CHECK OTP EXPIRATION
    // ==========================================

    if (
      !user.otpExpire ||
      Date.now() > user.otpExpire
    ) {
      return next(
        new ErrorHandler(
          "OTP has expired. Please request a new one.",
          400,
        ),
      );
    }

    // ==========================================
    // CHECK OTP
    // ==========================================

    if (
      String(user.otp) !==
      String(otp)
    ) {
      return next(
        new ErrorHandler(
          "Invalid OTP",
          400,
        ),
      );
    }

    // ==========================================
    // UPDATE PASSWORD
    // ==========================================

    user.password =
      await bcrypt.hash(
        password,
        10,
      );

    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  },
);