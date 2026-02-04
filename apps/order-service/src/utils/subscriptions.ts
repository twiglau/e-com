import { kafkaConsumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscriptions = async () => {
  kafkaConsumer.subscribe([
    {
      name: "payment.successful",
      handler: async (message) => {
        const order = message.value;
        await createOrder(order);
      },
    },
  ]);
};
