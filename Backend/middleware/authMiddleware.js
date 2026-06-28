import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required, no token found",
      });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    //Fetch user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // req.user = decoded; {if not fetched the user above we can directly do this i.e. (no need to fetch the user )}

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};



export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied, role ${req.user.role} is not authorized`,
      });
    }

    next();
  };
};
