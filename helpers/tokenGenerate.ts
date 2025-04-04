import  jwt from "jsonwebtoken"
import { JWT_SECRET } from "../config";

const tokenGenerator = (user) => {
  const payload = {
    user: user.nameUser,
    password: user.password,
    userid: user._id,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: "5d" });
};

export { tokenGenerator };
