import { Router } from "express";
let userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json("hello");
});

userRouter.get("/:id", (req, res) => {
  res.json("hello");
});

userRouter.post("/", (req, res) => {
  res.json("hello");
});

userRouter.put("/:id", (req, res) => {
  res.json("hello");
});

userRouter.delete("/:id", (req, res) => {
  res.json("hello");
});

export default userRouter;
