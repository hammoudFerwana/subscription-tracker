import { ARJECT_KEY } from "./env.js";
import arcjet, { detectBot, shield, tokenBucket } from "@arcjet/node";
export const aj = arcjet({
  key: ARJECT_KEY,
  rules: [
    shield({ mode: "LIVE" }),

    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "POSTMAN"],
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Refill every 10 seconds
      capacity: 10, // Bucket capacity of 10 tokens
    }),
  ],
});
