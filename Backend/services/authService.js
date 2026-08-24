import bcrypt from "bcrypt";

import authRepository from "../repositories/authRepository.js"
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import { transporter } from "../config/nodemailer.js";
import { generateToken } from "../utils/jwt.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import fs from "fs";

class AuthService {
  async registerUser(data, file) {
    const { name, email, password, role, shopName, specialization } = data;

    if (!name || !email || !password) {
      throw new ErrorHandler("All fields are required", 400);
    }

    const existingUser = await authRepository.findUserByEmail(email);

    if (existingUser) {
      throw new ErrorHandler("User already exists with this email", 400);
    }

    let images = {};

    if (file) {
      const uploaded = await UploadToCloudinary(file.path, "E-commerce");

      images = {
        url: uploaded.url,
        public_id: uploaded.public_id,
        path: uploaded.path,
      };

      if (file.path && fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await authRepository.createUser({
      name,
      email,
      images,
      password: hashedPassword,
      otp,
      otpExpire: Date.now() + 10 * 60 * 1000,
      role: role || "buyer",
    });

    if (role === "seller") {
      await authRepository.createSeller({
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

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async loginUser(email, password) {
    if (!email || !password) {
      throw new ErrorHandler("Email and password are required", 400);
    }

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new ErrorHandler("Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new ErrorHandler("Invalid email or password", 401);
    }

    if (!user.isActive) {
      throw new ErrorHandler(
        "Account has been deactivated. Contact admin.",
        403,
      );
    }

    // Check seller status
    if (user.role === "seller") {
      const seller = await authRepository.findSellerByUserId(user._id);

      if (seller && seller.verificationStatus === "blocked") {
        throw new ErrorHandler(
          "Your seller account has been blocked. Contact admin.",
          403,
        );
      }
    }

    const token = generateToken(user._id);

    return {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async getCurrentUser(userId) {
    const user = await authRepository.findUserByIdWithoutPassword(userId);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    return user;
  }

  async updateProfile(userId, data, file) {
    const { name, phone, address } = data;

    let user = await authRepository.findUserByIdWithoutPassword(userId);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    user.name = name;
    user.phone = phone;
    user.address = address;

    await authRepository.saveUser(user);

    if (file) {
      if (user.images?.public_id) {
        await deleteCloudinaryImage(user.images.public_id);
      }

      if (user.images?.path && fs.existsSync(user.images.path)) {
        fs.unlinkSync(user.images.path);
      }

      const uploaded = await UploadToCloudinary(file.path, "E-commerce");

      user.images = {
        url: uploaded.url,
        public_id: uploaded.public_id,
        path: uploaded.path,
      };

      await authRepository.saveUser(user);
    }

    return user;
  }

  async verifyOTP(email, otp) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (!user.otp || !user.otpExpire) {
      throw new ErrorHandler("No OTP found. Please request a new one.", 400);
    }

    if (Date.now() > user.otpExpire) {
      throw new ErrorHandler("OTP has expired. Please request a new one.", 400);
    }

    if (user.otp !== otp) {
      throw new ErrorHandler("Invalid OTP", 400);
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpire = null;

    await authRepository.saveUser(user);
  }

  async forgotPassword(email) {
    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000;

    await authRepository.saveUser(user);

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
  }

  async resetPassword(email, otp, password) {
    if (!email || !otp || !password) {
      throw new ErrorHandler("Email, OTP and new password are required", 400);
    }

    const user = await authRepository.findUserByEmail(email);

    if (!user) {
      throw new ErrorHandler("User not found", 404);
    }

    if (!user.otpExpire || Date.now() > user.otpExpire) {
      throw new ErrorHandler("OTP has expired. Please request a new one.", 400);
    }

    if (String(user.otp) !== String(otp)) {
      throw new ErrorHandler("Invalid OTP", 400);
    }

    user.password = await bcrypt.hash(password, 10);

    user.otp = null;
    user.otpExpire = null;

    await authRepository.saveUser(user);
  }
}

export default new AuthService();
