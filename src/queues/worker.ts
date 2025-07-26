import { Worker } from "bullmq";
import IORedis from "ioredis";
import { sendMails } from "../utils/mailer";

const connection = new IORedis({ maxRetriesPerRequest: null });

export const WorkerMailJob = async (subject: string, template: string) => {
  try {
    const worker = new Worker(
      "newsletter-queue",
      async (job) => {
        const data = await job.data;
        if (!data) {
          return "Not able to get the emai";
        }

        // send mail
        const info = await sendMails({
          email: data,
          body: template,
          subject: subject,
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
