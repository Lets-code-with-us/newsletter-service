import mongoose from "mongoose";

const failedInfo = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    info: {
      type: String,
      default: "Failed to send mail",
    },
  },
  { timestamps: true }
);

export const FailedEmails =
  mongoose.models.FailedEmails || mongoose.model("FailedEmails", failedInfo);
