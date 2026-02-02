import fastify from "fastify";
import { clerkPlugin, getAuth } from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = fastify();

app.register(clerkPlugin);

app.get("/", (req, res) => {
  return res.send({ message: "Order endpoint works!" });
});

app.get("/test", { preHandler: shouldBeUser }, async (req, res) => {
  return res.send({
    message: "Order service authenticated",
    userId: req.userId,
  });
});

const start = async () => {
  try {
    await app.listen({ port: 8001, host: "0.0.0.0" });
    console.log(`Order Server listening at http://localhost:8001`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
