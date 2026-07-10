import Product from "../models/productModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import Cart from "../models/cartModel.js";
import Order from "../models/orderModel.js";
import Seller from "../models/sellerModel.js";

// get all users
export const getAllUsers = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const search = req.query.search || "";
    const role = req.query.role;

    const filter = {};

    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select("-password")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    const totalUsers = await User.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      totalUsers: totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get user by id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// togele user
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be blocked",
      });
    }

    user.isActive = !user.isActive;

    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully`,

      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    // Find user
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account cannot be deleted",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete your own account",
      });
    }

    // Delete seller products
    if (user.role === "seller") {
      await Product.deleteMany({
        seller: user._id,
      });
    }

    // Delete user's reviews
    await Review.deleteMany({
      user: user._id,
    });

    // Delete user's cart
    await Cart.deleteOne({
      user: user._id,
    });

    // Delete user's orders
    await Order.deleteMany({
      user: user._id,
    });

    // Delete user
    await User.findByIdAndDelete(user._id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get all seller

export const getAllSellers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);

    const skip = (page - 1) * limit;

    const total = await Seller.countDocuments();

    const sellers = await Seller.find()
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: sellers.length,
      total_seller: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: { sellers },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get seller by id
export const getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).populate(
      "user",
      "name email role",
    );

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    res.status(200).json({
      success: true,
      data: seller,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//verify seller
export const verifySeller = async (req, res) => {
  try {
    const { status } = req.body; // approved or rejected
    console.log(status)

    if (!["approved","pending", "rejected"].includes(verificationStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be either approved or rejected",
      });
    }

    const seller = await Seller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.verificationStatus = status;

    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller ${status} successfully`,
      data: { seller },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to verify seller",
      error: error.message,
    });
  }
};

// Block / unBlock seller

export const blockSeller = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.sellerId);

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found",
      });
    }

    seller.isBlocked = !seller.isBlocked;

    await seller.save();

    res.status(200).json({
      success: true,
      message: `Seller ${
        seller.isBlocked ? "blocked" : "unblocked"
      } successfully`,
      data: { seller },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to block seller",
      error: error.message,
    });
  }
};

// get all products



/*
========================================
ADMIN - GET ALL PRODUCTS
GET /api/admin/products
========================================
*/

export const getAllProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const category = req.query.category;
    const seller = req.query.seller;
    const status = req.query.status;

    const query = {};

    if (search) {
      query.name = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.category = category;
    }

    if (seller) {
      query.seller = seller;
    }

    if (status) {
      query.status = status;
    }

    const totalProducts = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate({
        path: "seller",
        select: "shopName verificationStatus isVerified",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: products.length,
      totalProducts,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete product

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Delete all reviews of this product
    await Review.deleteMany({
      product: product._id,
    });

    // Remove product from all carts
    await Cart.updateMany(
      {},
      {
        $pull: {
          items: {
            product: product._id,
          },
        },
      },
    );

    // Delete the product
    await Product.findByIdAndDelete(product._id);

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

// get all orders

export const getAllOrders = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const status = req.query.status;
    const paymentStatus = req.query.paymentStatus;
    const buyer = req.query.buyer;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (buyer) {
      query.buyer = buyer;
    }

    const totalOrders = await Order.countDocuments(query);

    const orders = await Order.find(query)
      .populate({
        path: "buyer",
        select: "name email",
      })
      .populate({
        path: "orderItems.product",
        select: "name price images",
      })
      .populate({
        path: "orderItems.sellerId",
        select: "shopName",
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      currentPage: page,
      totalPages: Math.ceil(totalOrders / limit),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// get order by id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate({
        path: "buyer",
        select: "name email phone address",
      })
      .populate({
        path: "orderItems.product",
        select: "name price images description",
      })
      .populate({
        path: "orderItems.sellerId",
        select: "shopName",
      });
    x;

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// dashboard stats


export const getDashboardStats = async (req, res) => {
  try {
    // USERS
    const totalUsers = await User.countDocuments({ role: "buyer" });

    // SELLERS
    const totalSellers = await Seller.countDocuments();
    const pendingSellers = await Seller.countDocuments({
      verificationStatus: "pending",
    });

    // PRODUCTS
    const totalProducts = await Product.countDocuments();

    // ORDERS
    const totalOrders = await Order.countDocuments();

    // REVENUE (only delivered orders)
    const revenueData = await Order.aggregate([
      {
        $match: { status: "delivered" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue =
      revenueData.length > 0 ? revenueData[0].totalRevenue : 0;

    // ORDER STATUS BREAKDOWN
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // format status into object
    const statusSummary = {};
    orderStatusStats.forEach((item) => {
      statusSummary[item._id] = item.count;
    });

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalSellers,
        pendingSellers,
        totalProducts,
        totalOrders,
        totalRevenue,
        orderStatus: statusSummary,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
