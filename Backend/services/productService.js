import productRepository from "../repositories/productRepository.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import ErrorHandler from "../utils/ErrorHandler.js";

class ProductService {
  checkSeller(user, message) {
    if (user.role !== "seller") {
      throw new ErrorHandler(message, 403);
    }
  }

  validateRequiredFields({
    name,
    description,
    price,
    category,
    stock,
  }) {
    if (
      !name ||
      !description ||
      price == null ||
      !category ||
      stock == null
    ) {
      throw new ErrorHandler(
        "Required fields are missing",
        400,
      );
    }
  }

  async uploadImages(files) {
    const images = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const imageUpload =
          await UploadToCloudinary(
            file.buffer,
            "E-commerce",
          );

        images.push({
          url: imageUpload.url,
          public_id: imageUpload.public_id,
          path: imageUpload.path,
        });
      }
    }

    return images;
  }

  async deleteImages(images) {
    if (!images || images.length === 0) {
      return;
    }

    for (const image of images) {
      if (image.public_id) {
        await deleteCloudinaryImage(
          image.public_id,
        );
      }
    }
  }

  parseTags(tags) {
    if (!tags) {
      return [];
    }

    return tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  async createProduct(user, productData, files) {
    this.checkSeller(
      user,
      "Only sellers can create products",
    );

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
    } = productData;

    this.validateRequiredFields({
      name,
      description,
      price,
      category,
      stock,
    });

    const images = await this.uploadImages(files);

    if (images.length === 0) {
      throw new ErrorHandler(
        "At least one image is required",
        400,
      );
    }

    const seller =
      await productRepository.findSellerByUser(
        user._id,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller profile not found",
        404,
      );
    }

    return await productRepository.createProduct({
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
      tags: this.parseTags(tags),
    });
  }

  async getAllProducts(queryParams) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;
    const skip = (page - 1) * limit;

    const {
      search,
      category,
      minPrice,
      maxPrice,
      tag,
    } = queryParams;

    const query = {};

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          tags: search,
        },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    const products =
      await productRepository.findProducts(
        query,
        skip,
        limit,
      );

    const total =
      await productRepository.countProducts(query);

    return {
      products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProductById(productId) {
    const product =
      await productRepository.findProductById(
        productId,
      );

    if (!product) {
      throw new ErrorHandler(
        "Product not found",
        404,
      );
    }

    return product;
  }

  async updateProduct(
    user,
    productId,
    productData,
    files,
  ) {
    this.checkSeller(
      user,
      "Only sellers can update products",
    );

    const product =
      await productRepository.findProductByIdAndSeller(
        productId,
        user._id,
      );

    if (!product) {
      throw new ErrorHandler(
        "Product not found or you are not the owner",
        404,
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
    } = productData;

    if (name) {
      product.name = name;
    }

    if (description) {
      product.description = description;
    }

    if (price != null) {
      product.price = price;
    }

    if (category) {
      product.category = category;
    }

    if (subCategory) {
      product.subCategory = subCategory;
    }

    if (brand != null) {
      product.brand = brand;
    }

    if (stock != null) {
      product.stock = stock;
    }

    if (originalPrice != null) {
      product.originalPrice = originalPrice;
    }

    if (status) {
      const allowedStatuses = [
        "active",
        "draft",
        "archived",
      ];

      if (allowedStatuses.includes(status)) {
        product.status = status;
      }
    }

    if (specifications) {
      product.specifications = specifications;
    }

    if (tags) {
      product.tags = this.parseTags(tags);
    }

    if (files && files.length > 0) {
      await this.deleteImages(product.images);

      const newImages =
        await this.uploadImages(files);

      product.images = newImages;
    }

    return await productRepository.saveProduct(
      product,
    );
  }

  async deleteProduct(user, productId) {
    this.checkSeller(
      user,
      "Only sellers can delete products",
    );

    const product =
      await productRepository.findProductByIdAndSeller(
        productId,
        user._id,
      );

    if (!product) {
      throw new ErrorHandler(
        "Product not found or you are not the owner",
        404,
      );
    }

    await this.deleteImages(product.images);

    await productRepository.deleteProduct(product);
  }

  async getMyProducts(user) {
    this.checkSeller(
      user,
      "Only sellers can access this",
    );

    const seller =
      await productRepository.findSellerByUser(
        user._id,
      );

    if (!seller) {
      throw new ErrorHandler(
        "Seller profile not found",
        404,
      );
    }

    return await productRepository.findProductsBySeller(
      seller._id,
    );
  }
}

export default new ProductService();