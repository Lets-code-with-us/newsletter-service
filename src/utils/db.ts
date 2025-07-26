import mongoose from "mongoose";

export const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
    console.log("connected");
  } catch (error) {
    console.log(error);
    return;
  }
};
