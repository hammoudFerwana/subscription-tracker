import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";
let authRouter = Router();

authRouter.post("/sing-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sing-out", signOut);

authRouter.post("/sing-out", (req, res) => {
  res.json("hello");
});

export default authRouter;
