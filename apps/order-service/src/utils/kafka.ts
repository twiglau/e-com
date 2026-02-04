import {
  createKafkaClient,
  createKafkaConsumer,
  createKafkaProducer,
} from "@repo/kafka";

const kafkaClient = createKafkaClient("order-service");

export const kafkaConsumer = createKafkaConsumer(kafkaClient, "order-group");
export const kafkaProducer = createKafkaProducer(kafkaClient);
