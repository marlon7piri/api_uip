import  {mongoose,Schema} from "mongoose"

import bcrypt from "bcryptjs"

const userSchema = new Schema(
  {
    nameUser: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    rol: { type: String, require: true },
    clasificacion: { type: String, require: true },

    status: { type: String, default: "activo" },
  },
  { timestamps: true }
);

userSchema.methods.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.methods.matchPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export default  mongoose.model("users", userSchema);
