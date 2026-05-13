import { config } from "dotenv";

config({
  path: `.env.${process.env.NODE_ENV || "development"}.local`,
});

console.log(process.env.NODE_ENV);

export const {
  PORT,
  NODE_ENV,
  DB_connection,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ARJECT_KEY,
  ARJECT_ENV,
} = process.env;
