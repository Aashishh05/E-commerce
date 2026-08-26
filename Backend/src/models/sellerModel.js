import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    shopName: {
      type: String,
      required: [true, "Shop name is required"],
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      maxlength: 1000,
      trim: true,
    },

    logo: {
      url: String,
      public_id: String,
    },

    contactNumber: {
      type: String,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    specialization: {
      type: String,
      required: [true, "Specialization is required"],
      trim: true,
    },

    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected","blocked"],
      default: "pending",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    totalSales: {
      type: Number,
      default: 0,
    },
    isVerified:{
      type:Boolean,
      default:false,
    },
    isBlocked:{
      type:Boolean,
      default:false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

sellerSchema.index({ verificationStatus: 1 });

const Seller = mongoose.model("Seller", sellerSchema);

export default Seller;
