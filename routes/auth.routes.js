import { Router } from "express";
import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

let authRouter = Router();

//api/v1/auth (post)
authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
