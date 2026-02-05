import {
  createKafkaClient,
  createKafkaConsumer,
  createKafkaProducer,
} from "@repo/kafka";

const kafkaClient = createKafkaClient("payment-service");

export const kafkaConsumer = createKafkaConsumer(kafkaClient, "payment-group");
export const kafkaProducer = createKafkaProducer(kafkaClient);
