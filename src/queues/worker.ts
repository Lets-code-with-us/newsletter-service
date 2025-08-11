import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { mailer } from "../utils/mail";

const connection = new IORedis(process.env.REDIS_DB!, {
  maxRetriesPerRequest: null,
});

let JOBS_PROCESSING = 0;
export const WorkerMailJob = async (subject: string, template: string) => {
  try {
    new Worker(
      "newsletter-queue",
      async (job) => {
        const data = await job.data;
        if (!data) {
          return "Not able to get the email";
        }
        JOBS_PROCESSING += 1;

        const info = await mailer.sendMail({
          from: `Letscode <letscode@lets-code.co.in>`,
          to: data,
          subject: subject,
          html: template,
        });
        console.log(info.accepted);
        console.log(JOBS_PROCESSING)
      },
      {
        connection,
        limiter: {
          max: 14,
          duration: 1000,
        },
      }
    );
  } catch (error) {
    return error;
  }
};
