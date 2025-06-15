import { timeStamp } from "console";
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      reqire: true,
    },
    public_id: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
    createdAt: {
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);
