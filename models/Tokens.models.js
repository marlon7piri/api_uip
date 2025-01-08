import  {mongoose,Schema} from "mongoose"

const tokensSchema = new Schema(
  {
    token: String,
    active: Boolean,
  },
  { timestamps: true }
);

export default mongoose.model("tokens", tokensSchema);
