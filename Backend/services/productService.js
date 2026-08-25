import productRepository from "../repositories/productRepository.js";
import UploadToCloudinary from "../utils/uploadCloudinaryImage.js";
import deleteCloudinaryImage from "../utils/deleteCloudinaryImage.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import redisClient from "../config/redis.js";

class ProductService {
  checkSeller(user, message) {
    if (user.role !== "seller") {
      throw new ErrorHandler(message, 403);
    }
  }

  validateRequiredFields({ name, description, price, category, stock }) {
    if (!name || !description || price == null || !category || stock == null) {
      throw new ErrorHandler("Required fields are missing", 400);
    }
  }

  async uploadImages(files) {
    const images = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const imageUpload = await UploadToCloudinary(file.buffer, "E-commerce");

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
        await deleteCloudinaryImage(image.public_id);
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

  // REDIS CACHE HELPERS

  async clearProductListCache() {
    let cursor = 0;
    const keys = [];

    do {
      const result = await redisClient.scan(cursor, {
        MATCH: "products:list:*",
        COUNT: 100,
      });

      cursor = result.cursor;

      if (result.keys.length > 0) {
        keys.push(...result.keys);
      }
    } while (cursor !== 0);

    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log("Product list cache cleared");
    }
  }

  async clearProductCache(productId) {
    await redisClient.del(`product:${productId}`);

    console.log(`Product cache cleared: ${productId}`);
  }

  async clearSellerProductCache(sellerId) {
    await redisClient.del(`products:seller:${sellerId}`);

    console.log(`Seller product cache cleared: ${sellerId}`);
  }

  // CREATE PRODUCT

  async createProduct(user, productData, files) {
    this.checkSeller(user, "Only sellers can create products");

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
      throw new ErrorHandler("At least one image is required", 400);
    }

    const seller = await productRepository.findSellerByUser(user._id);

    if (!seller) {
      throw new ErrorHandler("Seller profile not found", 404);
    }

    const product = await productRepository.createProduct({
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

    // CLEAR CACHE AFTER CREATE

    // Product lists have changed
    await this.clearProductListCache();

    // Seller's product list has changed
    await this.clearSellerProductCache(seller._id);

    console.log("Product created and Redis cache cleared");

    return product;
  }

  // GET ALL PRODUCTS

  async getAllProducts(queryParams) {
    const page = Number(queryParams.page) || 1;
    const limit = Number(queryParams.limit) || 10;

    const skip = (page - 1) * limit;

    const { search, category, minPrice, maxPrice, tag } = queryParams;

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

    // CREATE UNIQUE CACHE KEY

    const cacheKey =
      `products:list:` +
      `${page}:` +
      `${limit}:` +
      `${search || ""}:` +
      `${category || ""}:` +
      `${minPrice || ""}:` +
      `${maxPrice || ""}:` +
      `${tag || ""}`;

    // CHECK REDIS

    const cachedProducts = await redisClient.get(cacheKey);

    if (cachedProducts) {
      console.log("Products fetched from Redis");

      return JSON.parse(cachedProducts);
    }

    // GET FROM MONGODB

    console.log("Products fetched from MongoDB");

    const products = await productRepository.findProducts(query, skip, limit);

    const total = await productRepository.countProducts(query);

    const result = {
      products,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };

    // SAVE TO REDIS

    await redisClient.setEx(cacheKey, 300, JSON.stringify(result));

    console.log("Products saved to Redis");

    return result;
  }

  // GET PRODUCT BY ID

  async getProductById(productId) {
    const cacheKey = `product:${productId}`;

    // CHECK REDIS

    const cachedProduct = await redisClient.get(cacheKey);

    if (cachedProduct) {
      console.log("Product fetched from Redis");

      return JSON.parse(cachedProduct);
    }

    // GET FROM MONGODB

    console.log("Product fetched from MongoDB");

    const product = await productRepository.findProductById(productId);

    if (!product) {
      throw new ErrorHandler("Product not found", 404);
    }

    // SAVE TO REDIS

    await redisClient.setEx(cacheKey, 300, JSON.stringify(product));

    console.log("Product saved to Redis");

    return product;
  }

  // UPDATE PRODUCT

  async updateProduct(user, productId, productData, files) {
    this.checkSeller(user, "Only sellers can update products");

    const product = await productRepository.findProductByIdAndSeller(
      productId,
      user._id,
    );

    if (!product) {
      throw new ErrorHandler("Product not found or you are not the owner", 404);
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
      const allowedStatuses = ["active", "draft", "archived"];

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

      const newImages = await this.uploadImages(files);

      product.images = newImages;
    }

    const updatedProduct = await productRepository.saveProduct(product);

    // CLEAR REDIS CACHE

    // Remove individual product cache
    await this.clearProductCache(productId);

    // Remove all product list caches
    await this.clearProductListCache();

    // Remove seller's product cache
    await this.clearSellerProductCache(product.seller);

    console.log("Product updated and Redis cache cleared");

    return updatedProduct;
  }

  // DELETE PRODUCT

  async deleteProduct(user, productId) {
    this.checkSeller(user, "Only sellers can delete products");

    const product = await productRepository.findProductByIdAndSeller(
      productId,
      user._id,
    );

    if (!product) {
      throw new ErrorHandler("Product not found or you are not the owner", 404);
    }

    await this.deleteImages(product.images);

    await productRepository.deleteProduct(product);

    // CLEAR REDIS CACHE

    // Remove individual product cache
    await this.clearProductCache(productId);

    // Remove product list caches
    await this.clearProductListCache();

    // Remove seller's product cache
    await this.clearSellerProductCache(product.seller);

    console.log("Product deleted and Redis cache cleared");
  }

  // GET MY PRODUCTS

  async getMyProducts(user) {
    this.checkSeller(user, "Only sellers can access this");

    const seller = await productRepository.findSellerByUser(user._id);

    if (!seller) {
      throw new ErrorHandler("Seller profile not found", 404);
    }

    const cacheKey = `products:seller:${seller._id}`;

    // CHECK REDIS

    const cachedProducts = await redisClient.get(cacheKey);

    if (cachedProducts) {
      console.log("Seller products fetched from Redis");

      return JSON.parse(cachedProducts);
    }

    // GET FROM MONGODB

    console.log("Seller products fetched from MongoDB");

    const products = await productRepository.findProductsBySeller(seller._id);

    // SAVE TO REDIS

    await redisClient.setEx(cacheKey, 300, JSON.stringify(products));

    console.log("Seller products saved to Redis");

    return products;
  }
}

export default new ProductService();
