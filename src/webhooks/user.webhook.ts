import Elysia from "elysia";
import { Newsletter } from "../schema/newsletter.schema";

export const webHookRouter = new Elysia({ prefix: "/api/v1/webhook" });


webHookRouter.post("/createduser", async (ctx) => {
  try {
    // @ts-ignore
    const { data} = await ctx.body;
    if (data) {
      return {
        messsage: "Not able to get the data",
      };
    }
    // create the user
    await Newsletter.create({
      email: data.email_addresses[0].email_address,
    });
  } catch (error) {
    return error;
  }
});
