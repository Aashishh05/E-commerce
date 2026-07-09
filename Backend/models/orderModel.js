import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      url: String,
      public_id: String,
      path:String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  //   { _id: false },  (No ID for each item)
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },

    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderItems: [orderItemSchema],

    shippingAddress: {
      name: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      index: true,
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "card", "esewa", "khalti", "upi"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    paymentResult: {
      id: String,
      status: String,
      updateTime: String,
      emailAddress: String,
    },

    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    trackingNumber: {
      type: String,
    },

    cancelReason: {
      type: String,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: Date,
  },
  { timestamps: true },
);

orderSchema.pre("save", function (next) {
  if (!this.orderId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    this.orderId = `ORD-${timestamp}-${random}`.toUpperCase();
  }
  next()
});

orderSchema.index({ "orderItems.sellerId": 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
