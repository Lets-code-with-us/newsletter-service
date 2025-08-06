import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDISURI!, {
  maxRetriesPerRequest: null,
});

export const WorkerMailJob = async (subject: string, template: string) => {
  try {
    new Worker(
      "newsletter-queue",
      async (job) => {
        const data = await job.data;
        if (!data) {
          return "Not able to get the email";
        }
        const userMails = JSON.parse(data);
        for (let index = 0; index < userMails.length; index++) {
          const element = userMails[index];
          console.log(element);
        }

        // send mail
        // const info = await sendMails({
        //   email: data,
        //   body: template,
        //   subject: subject,
        // });
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
