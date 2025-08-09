import { Elysia, status } from "elysia";
import { Newsletter } from "../schema/newsletter.schema";


export const Router = new Elysia({ prefix: "/api/v1" });

// health check
Router.get("/health", () => {
  return status(200, "OK");
});

// upload emails
// Router.post("/upload-mail", async (ctx) => {
//   try {
//     const data = new FormData();
//     console.log(data.get("emails"));
//     return {
//       message: "success",
//     };
//   } catch (error) {
//     return {
//       message: error,
//     };
//   }
// });

// subscribe newsletter
Router.post("/subscribe", async (ctx) => {
  try {
    const data = (await ctx.body) as any;
    if (!data) {
      return {
        message: "Email is required",
      };
    }
    const findUser = await Newsletter.findOne({
      email: data.email,
    });
    if (findUser) {
      return status(403, "Email already exist");
    }
    const newSubscriber = await new Newsletter({
      email: data.email,
    });
    await newSubscriber.save();
    return status(201, "Created");
  } catch (error) {
    return {
      message: error,
    };
  }
});

// unsubscribe newsletter
Router.post("/unsubscribe", async (ctx) => {
  try {
    const data = (await ctx.body) as any;
    if (!data) {
      return {
        message: "Require email",
      };
    }
    const findSubscriber = await Newsletter.findOne({
      email: data.email,
    });
    if (findSubscriber.subscriber == false) {
      return status(404, "User not found");
    }

    await Newsletter.findOneAndUpdate(
      {
        email: data.email,
      },
      {
        subscriber: false,
        unsubscribeReason:data.reason
      }
    );
    return status(200, "OK");
  } catch (error) {
    return {
      message: error,
    };
  }
});
