import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstach.js";
import Subscription from "../models/subscription.modle.js";
import asyncHandler from "../util/asyncHandler.js";

export const createSubscription = asyncHandler(async (req, res, next) => {
  //! Note: the arrangment is important here so if i put the user :req.user._id before the ...req.body it will be override by the user field in the body if it exist
  let subcription = await Subscription.create({
    ...req.body,
    user: req.user._id,
  });

  // trigger the workflow to send reminders before the renewal date
  // 1- the url is the endpoint of the workflow route that i created in the routes/Workflow.route.js file and this endpoint
  // 2- the body is the data that i want to pass to the workflow and this data will be available in the workflow through the context.requestPayload
  await workflowClient.trigger({
    url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
    body: {
      subscriptionId: subcription._id.toString(),
    },
    headers: {
      "Content-Type": "application/json",
    },
    // retries is the number of times the workflow will retry to run the function in case of failure and i set it to 0 because i don't want to retry if there is an error in the workflow and i want to handle the error in the workflow itself
    retries: 0,
  });

  res.status(201).json({
    success: true,
    data: subcription,
  });
});

export const getUserSubscriptions = asyncHandler(async (req, res, next) => {
  if (req.user._id.toString() !== req.params.userId) {
    return next(
      new Error("You are not allowed to access this user's subscriptions"),
    );
  }
  const userSubscription = await Subscription.find({
    user: req.params.userId,
  }).populate("user", "name email");

  res.status(200).json({
    success: true,
    data: userSubscription,
  });
});

export const getSubscriptionById = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById({
    _id: req.params.id,
    user: req.user._id, //(this is to compare the user field in the DB with the user is logged in) to made conditional query so it will return null if the subscription does not belong to the user
  }).populate("user", "name email");

  if (!subscription) {
    return next(new Error("Subscription not found"));
  }
  /** 
  this is to make sure that the user can access only his subscription and not other users subscription
  //? i did this in better way by adding the user : req.user._id in the findById query so it will return null if the subscription does not belong to the user
  if (subscription.user._id.toString() !== req.user._id.toString()) {
  return next(new Error("You are not allowed to access this subscription"));
     }
  */
  res.status(200).json({
    success: true,
    data: subscription,
  });
});

export const updateSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!subscription) {
    return next(new Error("Subscription not found"));
  }

  const allowedUpdates = [
    "name",
    "price",
    "currency",
    "frequency",
    "category",
    "paymentMethod",
    "status",
    "startDate",
  ];

  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      subscription[field] = req.body[field];
    }
  });

  await subscription.save();

  res.status(200).json({
    success: true,
    data: subscription,
  });
});

export const deleteSubscription = asyncHandler(async (req, res, next) => {
  const subscription = await Subscription.findById({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!subscription) {
    return next(new Error("Subscription not found"));
  }

  subscription.isDeleted = true;
  subscription.status = "canceled";
  subscription.deletedAt = new Date();
  await subscription.save();

  res.status(200).json({
    success: true,
    message: "Subscription deleted (soft delete)",
  });
});
