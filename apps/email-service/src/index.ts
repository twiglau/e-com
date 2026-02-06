import sendMail from "./utils/mailer";
import { createKafkaClient, createKafkaConsumer } from "@repo/kafka";

const kafka = createKafkaClient("email-service");
const consumer = createKafkaConsumer(kafka, "email-group");

const start = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe([
      {
        name: "user.created",
        handler: async (message) => {
          const { email, username } = message.value;

          if (email) {
            await sendMail({
              email,
              subject: "Welcome to E-commerce App",
              text: `Welcome ${username}. You account has been created!`,
            });
          }
        },
      },
      {
        name: "order.created",
        handler: async (message) => {
          const { email, amount, status } = message.value;

          if (email) {
            await sendMail({
              email,
              subject: "Order has been created",
              text: `Hello! Your order: Amount: ${amount / 100}, Status: ${status}`,
            });
          }
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
};

start();
