import { Router } from "express";
import { authorize } from "../middlewares/auth.middleware.js";
import { sendReminders } from "../controllers/workflow.controller.js";

const workflowRouter = Router();

workflowRouter.post("/subscription/reminder", sendReminders);

export default workflowRouter;
