import mongoose, { Document, Model, model, Schema } from "mongoose";

export interface IPost extends Document {
  titulo: string;
  url: string;
  public_id: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}
const PostSchema: Schema<IPost> = new mongoose.Schema(
  {
    titulo: {
      type: String,
    },
    url: {
      type: String,
      reqire: true,
    },
    public_id: {
      type: String,
      require: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
);

export const Post: Model<IPost> = model<IPost>("post", PostSchema);
