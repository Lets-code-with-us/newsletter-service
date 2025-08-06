import { Queue, QueueEvents } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_DB!, {
  maxRetriesPerRequest: null,
});

export const logsQueue = new Queue("logs-queue", {
  connection: connection,
});

export const queuelogsEvents = new QueueEvents("logs-queue");
