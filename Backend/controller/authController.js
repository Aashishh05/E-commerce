import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import authService from "../services/authService.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = asyncErrorHandler(async (req, res) => {
  const result = await authService.registerUser(req.body, req.file);

  res.cookie("token", result.token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Registration successful",
    data: result,
  });
});

export const loginUser = asyncErrorHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  res.cookie("token", result.token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: result,
  });
});

export const logout = asyncErrorHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0),
  });

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

export const getUser = asyncErrorHandler(async (req, res) => {
  const user = await authService.getCurrentUser(req.user.id);

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
});

export const updateProfile = asyncErrorHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body, req.file);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: {
      user,
    },
  });
});

export const verifyOTP = asyncErrorHandler(async (req, res) => {
  const { email, otp } = req.body;

  await authService.verifyOTP(email, otp);

  res.status(200).json({
    success: true,
    message: "OTP verified successfully",
  });
});

export const forgotPassword = asyncErrorHandler(async (req, res) => {
  const { email } = req.body;

  await authService.forgotPassword(email);

  res.status(200).json({
    success: true,
    message: "OTP sent to your email",
  });
});

export const resetPassword = asyncErrorHandler(async (req, res) => {
  const { email, otp, password } = req.body;

  await authService.resetPassword(email, otp, password);

  res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});
