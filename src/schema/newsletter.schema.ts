import mongoose from "mongoose";

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  subscriber: {
    type: Boolean,
    default: true,
  },
},{timestamps:true});


export const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter",NewsletterSchema)
