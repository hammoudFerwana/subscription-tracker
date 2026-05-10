import mongoose from "mongoose";
import { DB_connection, NODE_ENV } from "../config/env.js";

if (!DB_connection) {
  throw new Error(
    "DB connection string is not defined in environment variables",
  );
}

async function connectDB() {
  try {
    await mongoose.connect(DB_connection);
    console.log(`Connected to MongoDB in ${NODE_ENV} environment`);
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1); // Exit the process with an error code
  }
}

export default connectDB;
