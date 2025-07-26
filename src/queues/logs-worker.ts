import { Worker } from "bullmq";
import IORedis from "ioredis";
import { Logs } from "../schema/logsmail.schema";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const WorkerJob = async () => {
  try {
    const worker = new Worker(
      "logs-queue",
      async (job) => {
        const data = await job.data;
        if (!data) {
          return "Not able to get the logs";
        }

        await Logs.create({
          logs: data,
        });
      },
      {
        connection,
        concurrency: 1,
      }
    );
  } catch (error) {
    return error;
  }
};
