import mongoose from "mongoose";

const logsMails = new mongoose.Schema(
  {
    logs: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Logs = mongoose.models.Logs || mongoose.model("Logs", logsMails);
