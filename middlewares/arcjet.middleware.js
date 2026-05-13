import { aj } from "../config/arcjet.js";
import appError from "../util/appErrs.js";
import asyncHandler from "../util/asyncHandler.js";

const arcjetMiddleware = async (req, res, next) => {
  // the {requested: 1} is the one request take a  one token from the token bucket so i have 10 tokens in the bucket and every one req. take one token
  const detection = await aj.protect(req, { requested: 1 });

  if (detection.isDenied()) {
    if (detection.reason.isBot()) {
      return next(new appError("Access denied: Bot detected", 403));
    }
    if (detection.reason.isRateLimit()) {
      return next(new appError("Access denied: Rate limit exceeded", 429));
    }
    return next(
      new appError("Access denied: Suspicious activity detected", 403),
    );
  }
  next();
};

export default arcjetMiddleware;
