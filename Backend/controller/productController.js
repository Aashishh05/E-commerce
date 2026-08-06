import Product from "../models/productModel.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import asyncErrorHandler from "../middleware/asyncErrorHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import Seller from "../models/sellerModel.js";

export const createProduct = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "seller") {
    return next(new ErrorHandler("Only sellers can create products", 403));
  }

  const {
    name,
    description,
    price,
    category,
    subCategory,
    brand,
    stock,
    originalPrice,
    status,
    specifications,
    tags,
  } = req.body;

  if (!name || !description || price == null || !category || stock == null) {
    return next(new ErrorHandler("Required fields are missing", 400));
  }

  let images = [];

  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const imageUpload = await UploadToCloudinary(file.buffer, "E-commerce");
      images.push({
        url: imageUpload.url,
        public_id: imageUpload.public_id,
        path: imageUpload.path,
      });
    }
  }

  if (images.length === 0) {
    return next(new ErrorHandler("At least one image is required", 400));
  }

  const seller = await Seller.findOne({
    user: req.user._id,
  });

  if (!seller) {
    return next(new ErrorHandler("Seller profile not found", 404));
  }
  const product = await Product.create({
    seller: seller._id,
    name,
    description,
    category,
    subCategory,
    brand,
    images,
    price,
    originalPrice: originalPrice || null,
    stock,
    status: status || "active",
    specifications: specifications || {},
    tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
});

export const getAllProducts = asyncErrorHandler(async (req, res, next) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const { search, category, minPrice, maxPrice, tag } = req.query;

  const query = {};

  if (search) {
    query.$or = [{ name: { $regex: search, $options: "i" } }, { tags: search }];
  }

  if (category) query.category = category;
  if (tag) query.tags = tag;

  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  const products = await Product.find(query)
    .populate("seller", "name email shopName")
    .populate("category", "name")
    .populate("subCategory", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Product.countDocuments(query);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const getProductById = asyncErrorHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("seller", "name email")
    .populate("category", "name")
    .populate("subCategory", "name");

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    data: product,
  });
});

export const updateProduct = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "seller") {
    return next(new ErrorHandler("Only sellers can update products", 403));
  }

  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.user._id,
  });

  if (!product) {
    return next(
      new ErrorHandler("Product not found or you are not the owner", 404),
    );
  }

  const {
    name,
    description,
    price,
    category,
    subCategory,
    brand,
    stock,
    status,
    originalPrice,
    specifications,
    tags,
  } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price != null) product.price = price;
  if (category) product.category = category;
  if (subCategory) product.subCategory = subCategory;
  if (brand != null) product.brand = brand;
  if (stock != null) product.stock = stock;
  if (originalPrice != null) product.originalPrice = originalPrice;

  if (status) {
    const allowed = ["active", "draft", "archived"];
    if (allowed.includes(status)) {
      product.status = status;
    }
  }

  if (specifications) product.specifications = specifications;
  if (tags) product.tags = tags.split(",").map((tag) => tag.trim());

  if (req.files && req.files.length > 0) {
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await deleteCloudinaryImage(img.public_id);
        }
      }
    }

    let newImages = [];
    for (const file of req.files) {
      const imageUpload = await UploadToCloudinary(file.buffer, "E-commerce");
      newImages.push({
        url: imageUpload.url,
        public_id: imageUpload.public_id,
        path: imageUpload.path,
      });
    }
    product.images = newImages;
  }

  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
});

export const deleteProduct = asyncErrorHandler(async (req, res, next) => {
  if (req.user.role !== "seller") {
    return next(new ErrorHandler("Only sellers can delete products", 403));
  }

  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.user._id,
  });

  if (!product) {
    return next(
      new ErrorHandler("Product not found or you are not the owner", 404),
    );
  }

  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      if (img.public_id) {
        await deleteCloudinaryImage(img.public_id);
      }
    }
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});
