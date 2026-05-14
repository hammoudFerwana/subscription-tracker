import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
  getSubscriptionById,
  updateSubscription,
  deleteSubscription,
} from "../controllers/subscription.controller.js";
import { get } from "mongoose";
let subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.json("hello");
});

subscriptionRouter.get("/:id", authorize, getSubscriptionById);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.get("/user/:userId", authorize, getUserSubscriptions);

subscriptionRouter.put(
  "/user/:userId/:subscriptionId/cancel",
  authorize,
  (req, res) => {
    res.json("hello");
  },
);

subscriptionRouter.get("upcoming-renewals", authorize, (req, res) => {
  res.json("hello");
});

export default subscriptionRouter;
