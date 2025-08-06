import { Elysia } from "elysia";
import { Newsletter } from "../schema/newsletter.schema";
import { myQueue } from "../utils/mailqueue";
import { WorkerMailJob } from "../queues/worker";
import { clerkClient } from "../utils/clerk";

interface PublishRequestBody {
  subject: string;
  template: string;
}

export const Router = new Elysia({ prefix: "/api/v1" });

// health check
Router.get("/health", async () => {
  const res = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("Health check done");
    }, 3000);
  });
  return res;
});

// publish bulk email
Router.post("/publish", async (ctx) => {
  try {
    const data = (await ctx.body) as PublishRequestBody;
    if (!data) {
      return {
        message: "Email template is required",
      };
    }
    const { subject, template } = data;

    const user = await clerkClient.users.getUserList();
    const users = user.data.map((u) => u.emailAddresses[0].emailAddress);

    // const users = await Newsletter.find({
    //   subscriber: true,
    // });
    // if (!users || users.length == 0) {
    //   return {
    //     message: "User not present",
    //   };
    // }

    await myQueue.add("emails", JSON.stringify(users));
    await WorkerMailJob(subject, template);

    return {
      message: "Queued",
    };
  } catch (error) {
    console.log(error);
    return error;
  }
});

// upload emails
Router.post("/upload-mail", async (ctx) => {
  try {
    const data = new FormData();
    console.log(data.get("emails"));
    return {
      message: "success",
    };
  } catch (error) {
    return {
      message: error,
    };
  }
});

// subscribe newsletter
Router.post("/subscribe", async (ctx) => {
  try {
    const data = await ctx.body;
    if (!data) {
      return {
        message: "Email is required",
      };
    }
    const findUser = await Newsletter.findOne({
      email: data,
    });
    if (findUser) {
      return {
        message: "Email already exists",
      };
    }
    const newSubscriber = await new Newsletter({
      email: data,
    });
    await newSubscriber.save();
    return {
      message: "Success",
    };
  } catch (error) {
    return {
      message: error,
    };
  }
});

// unsubscribe newsletter
Router.post("/unsubscribe", async (ctx) => {
  try {
    const data = await ctx.body;
    if (!data) {
      return {
        message: "Require email",
      };
    }
    const findSubscriber = await Newsletter.findOne({
      email: data,
    });
    if (!findSubscriber) {
      return {
        message: "User not found",
      };
    }

    await Newsletter.findOneAndUpdate(
      {
        email: data,
      },
      {
        subscriber: false,
      }
    );
    return {
      message: "success",
    };
  } catch (error) {
    return {
      message: error,
    };
  }
});
