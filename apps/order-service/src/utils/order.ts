import { OrderModel } from "@repo/order-db";
import { OrderType } from "@repo/types";
import { kafkaProducer } from "./kafka";

export const createOrder = async (order: OrderType) => {
  const newOrder = new OrderModel(order);
  try {
    const order = await newOrder.save();
    kafkaProducer.send("order.created", {
      value: {
        email: order.email,
        amount: order.amount,
        status: order.status,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
};
