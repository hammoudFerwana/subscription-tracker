import { Router } from "express";
import { getAllUsers, getUser } from "../controllers/user.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

let userRouter = Router();

userRouter.get("/", authorize, getAllUsers);

userRouter.get("/:id", authorize, getUser);

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
