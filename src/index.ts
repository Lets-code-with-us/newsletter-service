import { Elysia } from "elysia";
import { Router } from "./routes/route";
import {webHookRouter} from "./webhooks/user.webhook"

const app = new Elysia();



app.use(Router);
app.use(webHookRouter);

app.get("/", () => "Hello Elysia").listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

