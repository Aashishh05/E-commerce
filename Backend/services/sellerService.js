import sellerRepository from "../repositories/sellerRepository.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class SellerService {
  async createSeller(user, sellerData) {
    const existingSeller =
      await sellerRepository.findSellerByUser(
        user._id,
      );

    if (existingSeller) {
      throw new ErrorHandler(
        "Seller profile already exists",
        400,
      );
    }

    const {
      shopName,
      description,
      contactNumber,
      address,
      verificationStatus,
      specialization,
    } = sellerData;

    if (!shopName || !specialization) {
      throw new ErrorHandler(
        "shopName and specialization are required",
        400,
      );
    }

    return await sellerRepository.createSeller({
      user: user._id,
      shopName,
      description,
      contactNumber,
      address,
      verificationStatus,
      specialization,
    });
  }

  async getSellerProfile(user) {
    const seller =
      await sellerRepository.findSellerByUserWithDetails(
        user._id,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller not found",
        404,
      );
    }

    return seller;
  }

  async getAllSellers() {
    return await sellerRepository.findAllSellers();
  }

  async getSellerById(sellerId) {
    const seller =
      await sellerRepository.findSellerById(
        sellerId,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller not found",
        404,
      );
    }

    return seller;
  }

  async updateSeller(user, sellerData) {
    const seller =
      await sellerRepository.findSellerByUser(
        user._id,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller not found",
        404,
      );
    }

    const {
      shopName,
      description,
      specialization,
    } = sellerData;

    if (shopName) {
      seller.shopName = shopName;
    }

    if (description) {
      seller.description = description;
    }

    if (specialization) {
      seller.specialization =
        specialization;
    }

    return await sellerRepository.saveSeller(
      seller,
    );
  }

  async verifySeller(sellerId, status) {
    if (
      !["approved", "rejected"].includes(
        status,
      )
    ) {
      throw new ErrorHandler(
        "Invalid verification status",
        400,
      );
    }

    const seller =
      await sellerRepository.findSellerByIdWithoutPopulate(
        sellerId,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller not found",
        404,
      );
    }

    seller.verificationStatus = status;

    return await sellerRepository.saveSeller(
      seller,
    );
  }
}

export default new SellerService();