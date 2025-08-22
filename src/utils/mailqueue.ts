import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_DB!, {
  maxRetriesPerRequest: null,
});

export const myQueue = new Queue("newsletter-queue", {
    connection   
});


