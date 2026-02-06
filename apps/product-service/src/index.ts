import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import categoryRouter from "./routes/category.route.js";
import productRouter from "./routes/product.route.js";
import { errorHandler } from "./utils/error.js";
import { kafkaProducer, kafkaConsumer } from "./utils/kafka.js";

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3002", "http://localhost:3003"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(clerkMiddleware());

app.get("/", (req, res) => {
  res.json({ message: "Product endpoint works!" });
});

app.get("/test", shouldBeUser, (req, res) => {
  res.json({ message: "Product service authenticated", userId: req.userId });
});

app.use("/categories", categoryRouter);
app.use("/products", productRouter);

app.use(errorHandler);

const start = async () => {
  try {
    await Promise.all([kafkaProducer.connect(), kafkaConsumer.connect()]);
    app.listen(8000, "0.0.0.0", () => {
      console.log("Product Server started on port 8000");
    });
  } catch (error) {
    console.log("Product Server failed to start", error);
    process.exit(1);
  }
};

start();
