import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import { createTransport } from "nodemailer";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

const sesClient = new SESv2Client({
  credentials: {
    accessKeyId: process.env.ACCESSKEYID!,
    secretAccessKey: process.env.SCERTKEYID!,
  },

  region: "ap-south-1",
});

export const mailer = createTransport({
  SES: { sesClient, SendEmailCommand },
});
