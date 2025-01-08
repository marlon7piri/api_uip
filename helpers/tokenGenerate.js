import  jwt from "jsonwebtoken"

const tokenGenerator = (user) => {
  const payload = {
    user: user.nameUser,
    password: user.password,
    userid: user._id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5d" });
};

export { tokenGenerator };
