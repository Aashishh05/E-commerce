import Category from "../models/categoriesModel.js";
import Seller from "../models/sellerModel.js";

class CategoryRepository {
  async findCategoryByName(name, excludeId = null) {
    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const query = {
      name: {
        $regex: new RegExp(`^${escapedName}$`, "i"),
      },
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return await Category.findOne(query);
  }

  async createCategory(categoryData) {
    return await Category.create(categoryData);
  }

  async findAllCategories() {
    return await Category.find().sort({ createdAt: -1 });
  }

  async findCategoryById(categoryId) {
    return await Category.findById(categoryId);
  }

  async saveCategory(category) {
    return await category.save();
  }

  async deleteCategory(category) {
    return await category.deleteOne();
  }

  async findSellerByUser(userId) {
    return await Seller.findOne({ user: userId });
  }

  async findCategoriesBySeller(sellerId) {
    return await Category.find({
      seller: sellerId,
    }).sort({
      createdAt: -1,
    });
  }
}

export default new CategoryRepository();