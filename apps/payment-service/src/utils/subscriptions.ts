import { createStripeProduct, deleteStripeProduct } from "./stripeProduct";
import { kafkaConsumer } from "./kafka";

export const runKafkaSubscriptions = () => {
  kafkaConsumer.subscribe([
    {
      name: "product.created",
      handler: async (message) => {
        const product = message.value;
        console.log("Received message: product.created", product);

        await createStripeProduct(product);
      },
    },
    {
      name: "product.deleted",
      handler: async (message) => {
        const productId = message.value;
        console.log("Received message: product.deleted", productId);

        await deleteStripeProduct(productId);
      },
    },
  ]);
};
