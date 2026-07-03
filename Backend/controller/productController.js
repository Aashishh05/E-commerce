import Product from "../models/productModel.js";

export const createProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can create products",
      });
    }

    const {
      name,
      description,
      price,
      category,
      subCategory,
      brand,
      stock,
      specifications,
      tags,
    } = req.body;

    if (!name || !description || price == null || !category || stock == null) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const product = await Product.create({
      seller: req.user._id,
      name,
      description,
      category,
      subCategory,
      brand,
      price,
      stock,
      specifications: specifications || {},
      tags: tags || [],
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create product",
      error: error.message,
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { search, category, minPrice, maxPrice, tag } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { tags: search },
      ];
    }

    if (category) query.category = category;
    if (tag) query.tags = tag;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .populate("seller", "name email")
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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    const product = await Product.findOne({
      $or: [{ _id: idOrSlug }, { slug: idOrSlug }],
    })
      .populate("seller", "name email")
      .populate("category", "name")
      .populate("subCategory", "name");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can update products",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you are not the owner",
      });
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

    if (status) {
      const allowed = ["Active", "Inactive", "Out of Stock"];
      if (allowed.includes(status)) {
        product.status = status;
      }
    }

    if (specifications) product.specifications = specifications;
    if (tags) product.tags = tags;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        success: false,
        message: "Only sellers can delete products",
      });
    }

    const product = await Product.findOne({
      _id: req.params.id,
      seller: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or you are not the owner",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
