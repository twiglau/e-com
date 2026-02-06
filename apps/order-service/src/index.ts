import fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware";
import { orderRoute } from "./routes/order";
import { connnectionOrderDb } from "@repo/order-db";
import { kafkaConsumer, kafkaProducer } from "./utils/kafka";
import { runKafkaSubscriptions } from "./utils/subscriptions";

const app = fastify();

app.register(clerkPlugin, {
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});

app.get("/", (req, res) => {
  return res.send({ message: "Order endpoint works!" });
});

app.get("/test", { preHandler: shouldBeUser }, async (req, res) => {
  return res.send({
    message: "Order service authenticated",
    userId: req.userId,
  });
});

app.register(orderRoute);

const start = async () => {
  try {
    console.log("🚀 Starting Order Service...");

    console.log("⏳ Connecting to DB...");
    await connnectionOrderDb();
    console.log("✅ DB connected");

    console.log("⏳ Connecting to Kafka Producer...");
    await kafkaProducer.connect();
    console.log("✅ Kafka Producer connected");

    console.log("⏳ Connecting to Kafka Consumer...");
    await kafkaConsumer.connect();
    console.log("✅ Kafka Consumer connected");

    runKafkaSubscriptions().catch((err: unknown) =>
      console.error("❌ Kafka subscription error:", err),
    );
    console.log("⏳ Kafka subscriptions starting in background...");

    const address = await app.listen({ port: 8001, host: "0.0.0.0" });
    console.log(`✅ Order Server listening at ${address}`);
  } catch (err) {
    console.error("❌ Order Service failed to start:", err);
    process.exit(1);
  }
};

start();
