import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import { Worker } from "bullmq";
import IORedis from "ioredis";
import { mailer } from "../utils/mail";
// import { errorLogger, infoLogger } from "../utils/logger";

const connection = new IORedis(process.env.REDIS_DB!, {
  maxRetriesPerRequest: null,
});

export const WorkerMailJob = async (subject: string, template: string) => {
  try {
    new Worker(
      "newsletter-queue",
      async (job) => {
        try {
          const data = await job.data;
          if (!data) {
            return "Not able to get the email";
          }
          mailer.sendMail(
            {
              from: `Letscode <letscode@lets-code.co.in>`,
              to: data,
              subject: subject,
              html: template,
            },
            (err, info) => {
              if (err) {
                console.error(err);
                return;
              }
              console.log(info.envelope);
              console.log(info.messageId);
            }
          );
        } catch (error) {
          console.log(error);
        }
      },
      {
        connection,
      }
    );
  } catch (error) {
    console.log(error);
    // errorLogger(JSON.stringify(error));
    return error;
  }
};
