import Seller from "../models/sellerModel";

export const createSeller = async (req, res) => {
  try {
    const userId = req.user._id;

    const existingSeller = await Seller.findOne({ user: userId });

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller profile already exists",
      });
    }

    const {
      shopName,
      description,
      logo,
      contactNumber,
      address,
      specialization,
    } = req.body;

    if (!shopName || !specialization) {
      return res.status(400).json({
        success: false,
        message: "shopname and specialization are required",
      });
    }

    const seller = await Seller.create({
      user: userId,
      shopName,
      description,
      contactNumber,
      address,
      specialization,
    });

    return res.status(201).json({
      success: true,
      message: "Seller profile created successfully",
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed creating seller",
      error: error.message,
    });
  }
};

const getSellerProfile = async (req, res) => {
  try {
    const seller = await Seller.findOne({ user: req.user._id }).populate(
      "user",
      "name email role",
    );

    if (!seller) {
      return res.status(404).json({
        success: true,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: false,
      message: "Seller profile fetched successfully",
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
      error: error.message,
    });
  }
};

export const getAllSeller = async (req, res) => {
  try {
    const sellers = await Seller.find().populate("user", "name email");

    res.status(200).json({
      success: true,
      message: "All seller fetched successfully",
      count: sellers.length,
      data: sellers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch all seller",
      error: error.message,
    });
  }
};

export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate(
      "user",
      "name email ",
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Seller fetched successfully",
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch seller",
      error: error.message,
    });
  }
};

export const updateSeller = async (req, res) => {
  try {
    const { shopName, description, specialization } = req.body;

    const seller = await Seller.findOne({ userId: req.user._id });

    if (!seller) {
      return res.status(400).json({
        success: false,
        message: "Seller not found",
      });
    }

    if (shopName) seller.shopName = shopName;
    if (description) seller.description = description;
    if (specialization) seller.specialization = specialization;

    await seller.save();

    res.status(201).json({
      success: true,
      message: "Seller updated successfully",
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update seller",
      error: error.message,
    });
  }
};

export const verifySeller = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification status",
      });
    }

    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.verificationStatus = status;
    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller ${status}`,
      seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
