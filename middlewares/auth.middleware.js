import appError from "../util/appErrs.js";
import asyncHandler from "../util/asyncHandler.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import User from "../models/user.model.js";

// this middleware will be to access to the routes for the users who have token only and logged in
export const authorize = asyncHandler(async (req, res, next) => {
  // 1- get token from header
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new appError("Not authorized to access this route", 401));
  }

  //2- verify token
  let decoded = jwt.verify(token, JWT_SECRET);

  //3- find user by id from decoded token
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new appError("User not found", 404));
  }
  //4- attach user to req object
  req.user = user;
  next();
});
