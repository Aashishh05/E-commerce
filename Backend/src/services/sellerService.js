import sellerRepository from "../repositories/sellerRepository.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import redisClient from "../config/redis.js";

class SellerService {
  async createSeller(user, sellerData) {
    const existingSeller = await sellerRepository.findSellerByUser(user._id);

    if (existingSeller) {
      throw new ErrorHandler("Seller profile already exists", 400);
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
      throw new ErrorHandler("shopName and specialization are required", 400);
    }

    const seller = await sellerRepository.createSeller({
      user: user._id,
      shopName,
      description,
      contactNumber,
      address,
      verificationStatus,
      specialization,
    });

    await redisClient.del(`seller:user:${user._id}`);
    await redisClient.del("sellers:all");

    return seller;
  }

  async getSellerProfile(user) {
    const cacheKey = `seller:user:${user._id}`;

    const cachedSeller = await redisClient.get(cacheKey);

    if (cachedSeller) {
      return JSON.parse(cachedSeller);
    }

    const seller = await sellerRepository.findSellerByUserWithDetails(user._id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(seller), {
      EX: 300,
    });

    return seller;
  }

  async getAllSellers() {
    const cacheKey = "sellers:all";

    const cachedSellers = await redisClient.get(cacheKey);

    if (cachedSellers) {
      return JSON.parse(cachedSellers);
    }

    const sellers = await sellerRepository.findAllSellers();

    await redisClient.set(cacheKey, JSON.stringify(sellers), {
      EX: 300,
    });

    return sellers;
  }

  async getSellerById(sellerId) {
    const cacheKey = `seller:${sellerId}`;

    const cachedSeller = await redisClient.get(cacheKey);

    if (cachedSeller) {
      return JSON.parse(cachedSeller);
    }

    const seller = await sellerRepository.findSellerById(sellerId);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    await redisClient.set(cacheKey, JSON.stringify(seller), {
      EX: 300,
    });

    return seller;
  }

  async updateSeller(user, sellerData) {
    const seller = await sellerRepository.findSellerByUser(user._id);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    const { shopName, description, specialization } = sellerData;

    if (shopName) {
      seller.shopName = shopName;
    }

    if (description) {
      seller.description = description;
    }

    if (specialization) {
      seller.specialization = specialization;
    }

    const updatedSeller = await sellerRepository.saveSeller(seller);

    await redisClient.del(`seller:user:${user._id}`);

    await redisClient.del(`seller:${seller._id}`);

    await redisClient.del("sellers:all");

    return updatedSeller;
  }

  async verifySeller(sellerId, status) {
    if (!["approved", "rejected"].includes(status)) {
      throw new ErrorHandler("Invalid verification status", 400);
    }

    const seller =
      await sellerRepository.findSellerByIdWithoutPopulate(sellerId);

    if (!seller) {
      throw new ErrorHandler("Seller not found", 404);
    }

    seller.verificationStatus = status;

    const updatedSeller = await sellerRepository.saveSeller(seller);

    await redisClient.del(`seller:${sellerId}`);

    await redisClient.del(`seller:user:${seller.user}`);

    await redisClient.del("sellers:all");

    return updatedSeller;
  }
}

export default new SellerService();
