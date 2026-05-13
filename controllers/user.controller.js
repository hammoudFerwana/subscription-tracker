import User from "../models/user.model.js";
import asyncHandler from "../util/asyncHandler.js";
import appError from "../util/appErrs.js";

export const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new appError("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});
