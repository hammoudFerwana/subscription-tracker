import express from "express";
import cookieParser from "cookie-parser";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouters from "./routes/subsicription.routes.js";
import connectDB from "./database/mongoDB.js";
import errorMiddleware from "./middlewares/error.middleware.js";
let app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("api/v1/auth", authRouter);
app.use("api/v1/users", userRouter);
app.use("api/v1/subscriptions", subscriptionRouters);

app.use(errorMiddleware);

// Handle 404 errors for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`app is run in http://localhost:${PORT}/`);
  connectDB();
});
