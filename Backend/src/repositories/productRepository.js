import Product from "../models/productModel.js";
import Seller from "../models/sellerModel.js";

class ProductRepository {
  async createProduct(productData) {
    return await Product.create(productData);
  }

  async findProductById(productId) {
    return await Product.findById(productId)
      .populate("seller", "name email")
      .populate("category", "name")
      .populate("subCategory", "name");
  }

  async findProductByIdAndSeller(productId, sellerId) {
    return await Product.findOne({
      _id: productId,
      seller: sellerId,
    });
  }

  async findProducts(query, skip, limit) {
    return await Product.find(query)
      .populate("seller", "name email shopName")
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  async countProducts(query) {
    return await Product.countDocuments(query);
  }

  async saveProduct(product) {
    return await product.save();
  }

  async deleteProduct(product) {
    return await product.deleteOne();
  }

  async findSellerByUser(userId) {
    return await Seller.findOne({
      user: userId,
    });
  }

  async findProductsBySeller(sellerId) {
    return await Product.find({
      seller: sellerId,
    })
      .populate("category", "name")
      .populate("subCategory", "name")
      .sort({ createdAt: -1 });
  }
}

export default new ProductRepository();