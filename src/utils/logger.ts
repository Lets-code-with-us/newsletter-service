import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: {
    service: "email-service",
  },
});

export const errorLogger = (error: string) => {
  if (process.env.NODE_ENV === "production") {
    logger.error(error);
    return;
  } else {
    console.error(error);
    return;
  }
};

export const infoLogger = (info: string) => {
  if (process.env.NODE_ENV === "production") {
    logger.info(info);
    return;
  } else {
    console.log(info);
    return;
  }
};
