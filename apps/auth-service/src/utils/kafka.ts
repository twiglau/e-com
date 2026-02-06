import { createKafkaClient, createKafkaProducer } from "@repo/kafka";

const kafka = createKafkaClient("auth-service");

export const kafkaProducer = createKafkaProducer(kafka);
