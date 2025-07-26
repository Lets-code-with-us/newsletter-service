import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URI!, {
  maxRetriesPerRequest: null,
});

export const myQueue = new Queue("newsletter-queue", {
  connection: connection,
});

export const queueEvents = new QueueEvents("newsletter-queue");
