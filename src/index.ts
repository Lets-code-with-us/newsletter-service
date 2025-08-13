import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});
import { Elysia, status } from "elysia";
import { Router } from "./routes/route";
import { swagger } from "@elysiajs/swagger";
import { myQueue } from "./utils/mailqueue";
import { WorkerMailJob } from "./queues/worker";
import { clerkClient } from "./utils/clerk";
import { connectDB } from "./utils/db";
import { cors } from "@elysiajs/cors";
// import { errorLogger,infoLogger } from "./utils/logger";

export const app = new Elysia().use(cors());
let page = 1;
let allUsers = [];
let MAX = 0;
let index = 0;

app.use(Router);
app.use(swagger());

app.get("/", () => status(200, "OK"));
app.get("/metrics", async () => {
  try {
    const info = await myQueue.exportPrometheusMetrics();
    return status(200, info);
  } catch (error) {
    return status(500, "Internal Server Error");
  }
});

app
  .ws("/ws", {
    open(ws) {
      ws.send("connected");
    },
    message(ws, message) {
      const info = Object(message as any);
      if (info.message === "BULKMAIL") {
        const UserMails = async () => {
          while (true) {
            const res = await clerkClient.users.getUserList({
              limit: 100,
              offset: (page - 1) * 100,
            });
            allUsers.push(...res.data);
            if (res.data.length < 100) break;
            page++;
          }

          let mails = allUsers.map((m) => m.emailAddresses[0].emailAddress);
          if (mails) {
            MAX = mails.length;
            ws.send(`Mails Queued - ${MAX}`);
          }

          let timerID = setInterval(() => {
            if (index != MAX) {
              myQueue.add("emails", mails[index]);
              WorkerMailJob(info.subject, info.body);
              index += 1
            } else {
              console.log("Cleared")
              clearInterval(timerID);
              return;
            }
          }, 2000);
        };
        UserMails();
      }
      if (info.message === "STATUS") {
        const StatusInfo = async () => {
          const jobs = await myQueue.getJobCounts();
          ws.send(`${JSON.stringify(jobs)}`);
        };
        setInterval(() => {
          StatusInfo();
        }, 2000);
      }
    },
  })
  .listen(3002);

connectDB(process.env.DB!)
  .then(() => {
    app.listen(3001);
  })
  .catch((e) => {
    console.log(e);
  });
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
