import { Router } from "express";

let authRouter = Router();

authRouter.post("/sing-up", (req, res) => {
  res.json("hello");
});
authRouter.post("/sign-in", (req, res) => {
  res.json("hello");
});
authRouter.post("/sing-out", (req, res) => {
  res.json("hello");
});

export default authRouter;
