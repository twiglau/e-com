import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { kafkaConsumer, kafkaProducer } from "./utils/kafka.js";
import { runKafkaSubscriptions } from "./utils/subscriptions.js";
import { cors } from "hono/cors";
import sessionRoute from "./routes/session.route.js";
import webhookRoute from "./routes/webhooks.route.js";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use("*", clerkMiddleware());

app.get("/", (c) => {
  return c.text("Payment endpoint works!");
});

app.route("/sessions", sessionRoute);
app.route("/webhooks", webhookRoute);

app.get("/test", shouldBeUser, (c) => {
  return c.json({ message: "Payment service authenticated" });
});

const start = async () => {
  try {
    // Promise.all([await kafkaConsumer.connect(), await kafkaConsumer.connect()]);
    // await runKafkaSubscriptions();
    serve(
      {
        fetch: app.fetch,
        port: 8002,
        hostname: "0.0.0.0",
      },
      (info) => {
        console.log(
          `Payment Server is running on http://localhost:${info.port}`,
        );
      },
    );
  } catch (error) {
    console.error("Failed to start payment service:", error);
    process.exit(1);
  }
};

start();
