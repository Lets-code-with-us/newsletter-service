import dotenv from "dotenv";
dotenv.config({
  path:".env"
})


import Redis from "ioredis"


export const client = new Redis(process.env.REDIS_DB!);


