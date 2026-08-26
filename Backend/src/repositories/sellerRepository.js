import Seller from "../models/sellerModel.js";

class SellerRepository {
  async findSellerByUser(userId) {
    return await Seller.findOne({
      user: userId,
    });
  }

  async findSellerByUserWithDetails(userId) {
    return await Seller.findOne({
      user: userId,
    }).populate(
      "user",
      "name email role",
    );
  }

  async createSeller(sellerData) {
    return await Seller.create(sellerData);
  }

  async findAllSellers() {
    return await Seller.find().populate(
      "user",
      "name email",
    );
  }

  async findSellerById(sellerId) {
    return await Seller.findById(
      sellerId,
    ).populate(
      "user",
      "name email",
    );
  }

  async findSellerByIdWithoutPopulate(sellerId) {
    return await Seller.findById(sellerId);
  }

  async saveSeller(seller) {
    return await seller.save();
  }
}

export default new SellerRepository();