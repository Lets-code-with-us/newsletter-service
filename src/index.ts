import { Elysia } from "elysia";
import { Router } from "./routes/route";
import { swagger } from "@elysiajs/swagger";
export const app = new Elysia();
import { myQueue } from "./utils/mailqueue";
import { WorkerMailJob } from "./queues/worker";

app.use(Router);
app.use(swagger());

app.get("/", () => "Hello Elysia");
app
  .ws("/ws", {
    open(ws) {
      ws.send("connected");
    },
    message(ws, message) {
      const info = Object(message as any);
      if (info.message === "BULKMAIL") {
        const payload = Object(message as any);
        myQueue.add("emails", "start");
        WorkerMailJob(payload.subject, payload.body);
        ws.send("got it");
        return;
      }
      if (info.message === "STATUS") {
        const StatusInfo = async () => {
          const jobs = await myQueue.getJobCounts();
          ws.send(`status - ${JSON.stringify(jobs)}`);
        };
        setInterval(() => {
          StatusInfo();
        }, 10000);
      }
    },
  })
  .listen(3002);

app.listen(3001);
console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
