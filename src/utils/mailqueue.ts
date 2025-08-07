import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDISDB!, {
  maxRetriesPerRequest: null,
});

export const myQueue = new Queue("newsletter-queue", {
  connection: connection,
});

export const queueEvents = new QueueEvents("newsletter-queue");
