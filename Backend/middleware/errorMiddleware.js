import ErrorHandler from "../utils/ErrorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // Invalid Mongo ObjectId
  if (err.name === "CastError") {
    err = new ErrorHandler("Resource not found", 404);
  }

  // Duplicate Key Error
  if (err.code === 11000) {
    const message = `${Object.keys(err.keyValue)} already exists`;
    err = new ErrorHandler(message, 400);
  }

  // Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((value) => value.message)
      .join(", ");

    err = new ErrorHandler(message, 400);
  }

  // JWT Error
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("Invalid Token", 401);
  }

  // JWT Expire Error
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("Token Expired", 401);
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default errorMiddleware;