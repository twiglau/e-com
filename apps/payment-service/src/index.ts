import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono();

app.use("*", clerkMiddleware());

app.get("/", (c) => {
  return c.text("Payment endpoint works!");
});

app.get("/test", shouldBeUser, (c) => {
  return c.json({ message: "Payment service authenticated" });
});

serve(
  {
    fetch: app.fetch,
    port: 8002,
    hostname: "0.0.0.0",
  },
  (info) => {
    console.log(`Payment Server is running on http://localhost:${info.port}`);
  },
);
