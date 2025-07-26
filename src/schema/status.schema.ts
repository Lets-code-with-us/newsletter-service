import mongoose from "mongoose";

const NewsletterStatus = new mongoose.Schema(
  {
    totalDelievered: {
      type: String,
      required: true,
    },
    totalFailed: {
      type: String,
      required: true,
    },
    totalunSubscribed: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Status =
  mongoose.models.Status || mongoose.model("Status", NewsletterStatus);
