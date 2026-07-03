import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: 2000,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Product category is required"],
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    brand: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: 0,
    },

    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      default: 0,
      min: 0,
    },

    images: {
      type: [
        {
          url: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
        },
      ],
      validate: {
        validator: (images) => images.length > 0,
        message: "At least one product image is required.",
      },
    },

    specifications: {
      type: Map,
      of: String,
    },

    tags: [
      {
        type: String,
        trim: true,
        index: true,
      },
    ],

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    sold: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Out of Stock"],
      default: "Active",
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
});

productSchema.index({ seller: 1 });
productSchema.index({ category: 1 });
productSchema.index({ subCategory: 1 });
productSchema.index({ status: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ averageRating: -1 });
productSchema.index({ sold: -1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
