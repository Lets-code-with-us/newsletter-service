import { Worker } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDISDB!, {
  maxRetriesPerRequest: null,
});

export const WorkerMailJob = async (subject: string, template: string) => {
  try {
    new Worker(
      "newsletter-queue",
      async (job) => {
        const data = await job.data;
        console.log(data);
        console.log(subject, template);
        if (!data) {
          return "Not able to get the email";
        }
        let bin = 0; 
        for (let index = 0; index < 1200000; index++) {
          bin += index;
        }
        console.log(bin)
        // const userMails = JSON.parse(data);
        // for (let index = 0; index < userMails.length; index++) {
        //   const element = userMails[index];
        //   console.log(element);
        // }

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
