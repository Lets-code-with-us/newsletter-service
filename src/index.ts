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

export const app = new Elysia().use(cors());
let page = 1;


app.use(Router);
app.use(swagger());

app.get("/", () => status(200, "OK"));
app
  .ws("/ws", {
    open(ws) {
      ws.send("connected");
    },
    message(ws, message) {
      const info = Object(message as any);
      if (info.message === "BULKMAIL") {
        const UserMails = async () => {
          let statusMail = 0;
          while (true) {
            console.log("fetching users");
            const res = await clerkClient.users.getUserList({
              limit: 100,
              offset: (page - 1) * 100,
            });
            let allUsers = await res.data;
            const mails = allUsers.map((m) => m.emailAddresses[0].emailAddress);
            if (mails.length > 0) {
              for (let index = 0; index < mails.length; index++) {
                statusMail += 1;
                await myQueue.add("emails", mails[index], {
                  removeOnComplete: {
                    age: 2 * 3600,
                  },
                  removeOnFail: {
                    age: 2 * 3600,
                  },
                });
                await WorkerMailJob(info.subject, info.body);
                ws.send(`${statusMail}`);
              }
            }

            if (res.data.length < 100) break;
            page++;
          }
          // console.log(allUsers);
          console.log(statusMail);

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
        }, 10000);
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
