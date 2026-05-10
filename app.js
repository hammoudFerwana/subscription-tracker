import express from "express";
import { PORT } from "./config/env.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouters from "./routes/subsicription.routes.js";
import connectDB from "./database/mongoDB.js";
let app = express();

app.use("api/v1/auth", authRouter);
app.use("api/v1/users", userRouter);
app.use("api/v1/subscriptions", subscriptionRouters);

app.listen(PORT, () => {
  console.log(`app is run in http://localhost:${PORT}}/`);
  connectDB();
});
