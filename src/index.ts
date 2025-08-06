import { Elysia } from "elysia";
import { Router } from "./routes/route";
import { swagger } from "@elysiajs/swagger";
export const app = new Elysia();

app.use(Router);
app.use(swagger());

app.get("/", () => "Hello Elysia").listen(3001);
app
  .ws("/ws", {
    open(ws) {
      ws.send("connected");
    },
    message(ws, message) {
      if (message === "status") {
        ws.send("mailed queued");
      }
    },
  })
  .listen(3002);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
