import Seller from "../models/sellerModel.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const createSeller = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;

  const existingSeller = await Seller.findOne({ user: userId });

  if (existingSeller) {
    return next(new ErrorHandler("Seller profile already exists", 400));
  }

  const {
    shopName,
    description,
    contactNumber,
    address,
    verificationStatus,
    specialization,
  } = req.body;

  if (!shopName || !specialization) {
    return next(
      new ErrorHandler("shopName and specialization are required", 400),
    );
  }

  const seller = await Seller.create({
    user: userId,
    shopName,
    description,
    contactNumber,
    address,
    verificationStatus,
    specialization,
  });

  res.status(201).json({
    success: true,
    message: "Seller profile created successfully",
    seller,
  });
});

export const getSellerProfile = asyncErrorHandler(async (req, res, next) => {
  const seller = await Seller.findOne({ user: req.user._id }).populate(
    "user",
    "name email role",
  );

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Seller profile fetched successfully",
    data: seller,
  });
});

export const getAllSeller = asyncErrorHandler(async (req, res, next) => {
  const sellers = await Seller.find().populate("user", "name email");

  res.status(200).json({
    success: true,
    message: "All sellers fetched successfully",
    count: sellers.length,
    data: sellers,
  });
});

export const getSellerById = asyncErrorHandler(async (req, res, next) => {
  const seller = await Seller.findById(req.params.id).populate(
    "user",
    "name email",
  );

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Seller fetched successfully",
    data: seller,
  });
});

export const updateSeller = asyncErrorHandler(async (req, res, next) => {
  const { shopName, description, specialization } = req.body;

  const seller = await Seller.findOne({ user: req.user._id });

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  if (shopName) seller.shopName = shopName;
  if (description) seller.description = description;
  if (specialization) seller.specialization = specialization;

  await seller.save();

  res.status(200).json({
    success: true,
    message: "Seller updated successfully",
    data: seller,
  });
});

export const verifySeller = asyncErrorHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return next(new ErrorHandler("Invalid verification status", 400));
  }

  const seller = await Seller.findById(req.params.id);

  if (!seller) {
    return next(new ErrorHandler("Seller not found", 404));
  }

  seller.verificationStatus = status;
  await seller.save();

  res.status(200).json({
    success: true,
    message: `Seller ${status}`,
    seller,
  });
});
