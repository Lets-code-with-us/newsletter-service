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
  unsubscribeReason:{
    type:String
  }
},{timestamps:true});


export const Newsletter = mongoose.models.Newsletter || mongoose.model("Newsletter",NewsletterSchema)
