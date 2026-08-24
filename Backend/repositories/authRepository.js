import User from "../models/userModel.js";
import Seller from "../models/sellerModel.js";

class AuthRepository {
  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async findUserByIdWithoutPassword(id) {
    return await User.findById(id).select("-password");
  }

  async createUser(userData) {
    return await User.create(userData);
  }

  async updateUser(user, data) {
    Object.assign(user, data);
    return await user.save();
  }

  async saveUser(user) {
    return await user.save();
  }

  async updateUserById(id, data) {
    return await User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).select("-password");
  }

  async createSeller(sellerData) {
    return await Seller.create(sellerData);
  }

  async findSellerByUserId(userId) {
    return await Seller.findOne({
      user: userId,
    });
  }
}

export default new AuthRepository();
