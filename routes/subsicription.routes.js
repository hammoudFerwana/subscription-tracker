import { Router } from "express";
let subscriptionRouter = Router();

subscriptionRouter.get("/", (req, res) => {
  res.json("hello");
});

subscriptionRouter.get("/:id", (req, res) => {
  res.json("hello");
});

subscriptionRouter.post("/", (req, res) => {
  res.json("hello");
});

subscriptionRouter.put("/:id", (req, res) => {
  res.json("hello");
});

subscriptionRouter.delete("/:id", (req, res) => {
  res.json("hello");
});

subscriptionRouter.get("/user/:userId", (req, res) => {
  res.json("hello");
});

subscriptionRouter.put("/user/:userId/:subscriptionId/cancel", (req, res) => {
  res.json("hello");
});

subscriptionRouter.get("upcoming-renewals", (req, res) => {
  res.json("hello");
});

export default subscriptionRouter;
