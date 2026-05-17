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
  QSTASH_URL,
  QSTASH_TOKEN,
  QSTASH_CURRENT_SIGNING_KEY,
  QSTASH_NEXT_SIGNING_KEY,
  SERVER_URL,
  EMAIL_PASSWORD,
} = process.env;
