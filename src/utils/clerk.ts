import dotenv from "dotenv";
dotenv.config({
  path: ".env",
});

import { createClerkClient } from "@clerk/backend";

export const clerkClient = createClerkClient({ secretKey: process.env.CLERK! });
