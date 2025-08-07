import dotenv from "dotenv";
dotenv.config({
  path:'.env'
})

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { mailer } from "../utils/mail";

const connection = new IORedis(process.env.REDIS_DB!,{
    maxRetriesPerRequest: null,
  }
);

export const WorkerMailJob = async (subject: string, template: string) => {
  try {
    new Worker(
      "newsletter-queue",
      async (job) => {
        const data = await job.data;
        if (!data) {
          return "Not able to get the email";
        }
        setTimeout(async () => {
          const info = await mailer.sendMail({
            from: `Letscode <letscode@lets-code.co.in>`,
            to: data,
            subject: subject,
            html: template,
          });
        }, 3000);
      },
      {
        connection,
        concurrency: 20,
      }
    );
  } catch (error) {
    return error;
  }
};
