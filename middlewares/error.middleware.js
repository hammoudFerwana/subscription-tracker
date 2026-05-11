import appError from "../util/appErrs.js";

const errorMiddleware = (err, req, res, next) => {
  try {
    let error = err;

    console.error("Error in errorMiddleware:", err);

    // Default values
    error.statusCode = error.statusCode || 500;
    error.status = error.status || "error";

    // Handle Mongoose Validation Error
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(", ");

      error = new appError(message, 400);
    }

    // Handle CastError
    if (err.name === "CastError") {
      const message = `Resource not found with id of ${err.value}`;
      error = new appError(message, 400);
    }

    // Handle Duplicate Key Error
    if (err.code === 11000) {
      const message = "Duplicate field value entered";
      error = new appError(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      error: error.message,
    });
  } catch (error) {
    console.error("Error in errorMiddleware:", error);
    next(error);
  }
};

export default errorMiddleware;
