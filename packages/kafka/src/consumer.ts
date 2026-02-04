import type { Consumer, Kafka } from "kafkajs";

export const createKafkaConsumer = (kafka: Kafka, groupId: string) => {
  const consumer: Consumer = kafka.consumer({ groupId });

  const connect = async () => {
    await consumer.connect();
    console.log("Kafka consumer connected:" + groupId);
  };
  const subscribe = async (
    topics: {
      name: string;
      handler: (message: any) => Promise<void>;
    }[],
  ) => {
    await consumer.subscribe({
      topics: topics.map((t) => t.name),
      fromBeginning: true,
    });
    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        try {
          const config = topics.find((t) => t.name === topic);
          if (config) {
            const value = message.value?.toString();
            if (value) {
              await config.handler(JSON.parse(value));
            }
          }
        } catch (error) {
          console.error("Kafka consumer error:", error);
        }
      },
    });
  };
  const disconnect = async () => {
    await consumer.disconnect();
  };
  return { connect, subscribe, disconnect };
};
