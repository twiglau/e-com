import fastify from "fastify";
import { clerkPlugin } from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware";
import { orderRoute } from "./routes/order";
import { connnectionOrderDb } from "@repo/order-db";

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
    await connnectionOrderDb();
    await app.listen({ port: 8001, host: "0.0.0.0" });
    console.log(`Order Server listening at http://localhost:8001`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
