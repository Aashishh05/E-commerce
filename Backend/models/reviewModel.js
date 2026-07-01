import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
    },

    rating: {
      type: Number,
      required: [true, "rating is required"],
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 150,
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// A user can review a product only once
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Fast product review fetching
reviewSchema.index({ product: 1, createdAt: -1 });

// Helpful for seller dashboards
reviewSchema.index({ seller: 1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
