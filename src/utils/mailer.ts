import nodemailer from "nodemailer";
import { ses } from "./mail";
import { logsQueue } from "./logqueue";
import { WorkerJob } from "../queues/logs-worker";

const transport = nodemailer.createTransport({
  SES: ses,
});

export const sendMails = async ({
  email,
  body,
  subject,
}: {
  email: string;
  body: string;
  subject: string;
}) => {
  try {
    const info = await transport.sendMail({
      from: "",
      to: email,
      subject: subject,
      html: body,
    });
    const status = await info.envelope;
    await logsQueue.add("logs", JSON.stringify(status));
    await WorkerJob();
  } catch (error) {
    console.log(error);
  }
};
