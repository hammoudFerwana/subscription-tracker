import asyncHandler from "../util/asyncHandler.js";
import mongoose from "mongoose";
import User from "../models/user.model.js";
import appError from "../util/appErrs.js";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let { name, email, password } = req.body;

    // cheak if the user exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      next(new appError("User already exists", 400));
      return;
    }

    const newUser = await User.create([{ name, email, password }], { session });

    // to not return the password in the response
    newUser[0].password = undefined;

    let token = jwt.sign({ id: newUser[0]._id }, process.env.JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
    await session.commitTransaction();
    await session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser[0],
      token,
    });
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    next(error);
  }
};
export const signIn = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new appError("Invalid email or password", 401));
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return next(new appError("Invalid email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  res.status(200).json({
    success: true,
    token,
  });
});
export const signOut = asyncHandler(async (req, res, next) => {});
