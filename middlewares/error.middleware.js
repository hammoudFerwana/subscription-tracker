const errorMiddleware = (err, req, res, next) => {
  try {
    let error = { ...err };
    error.message = err.message;
    console.error("Error in errorMiddleware:", error);

    // Handle Mongoose validation errors
    if (err.name === "ValidationError") {
      error.statusCode = 400;
      error.message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");
    }
    // Handle Mongoose bad ObjectId
    if (err.name === "CastError") {
      error.statusCode = 400;
      error.message = `Resource not found with id of ${err.value}`;
      error = new Error(error.message);
    }

    // Handle Mongoose duplicate key error
    if (err.code === 11000) {
      error.statusCode = 400;
      error.message = "Duplicate field value entered";
      error = new Error(error.message);
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || "Server Error",
    });
  } catch (error) {
    console.error("Error in errorMiddleware:", error);
    next(error);
  }
};

export default errorMiddleware;
