import  jwt  from "jsonwebtoken"
import  Tokens  from "../models/Tokens.models.js"

const isAuth = async (req, res, next) => {
  const { token } = req.headers;
  const dataToken = await Tokens.findOne({ token });
  try {
    if (token) {
      if (dataToken !== null && dataToken.active) {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
      } else {
        throw {
          code: 403,
          status: "ACCESS_DENIED",
          message: "Expired token",
        };
      }
    } else {
      throw {
        code: 403,
        status: "ACCESS_DENIED",
        message: "Missing header token",
      };
    }
  } catch (e) {
    if (token) {
      if (dataToken !== null && dataToken.active) {
        await Tokens.findOneAndUpdate({ token }, { active: false });
        res.status(403).send({
          status: "ACCESS_DENIED",
          message: "Expired token",
        });
      } else {
        res
          .status(e.code || 500)
          .send({ status: e.status || "ERROR", message: e.message });
      }
    } else {
      res.status(403).send({
        status: "ACCESS_DENIED",
        message: "Missing header token",
      });
    }
  }
};

export  { isAuth };
