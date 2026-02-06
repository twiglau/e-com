import {
  createKafkaClient,
  createKafkaProducer,
  createKafkaConsumer,
} from "@repo/kafka";

const kafkaClient = createKafkaClient("product-service");

export const kafkaProducer = createKafkaProducer(kafkaClient);
export const kafkaConsumer = createKafkaConsumer(kafkaClient, "product-group");
