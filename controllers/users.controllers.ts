import { Request, Response } from "express"
import { tokenGenerator } from "../helpers/tokenGenerate";
import Tokens from "../models/Tokens.models";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Users from "../models/User.models";

const isValidEmail = (email: string) => {
  const patron = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  return patron.test(email);
};

const create = async (req: Request, res: Response): Promise<any> => {
  const { nameUser, email, password, rol, clasificacion, nombre, apellido } = req.body;
  try {
    const emailUser = await Users.findOne({ email });

    if (emailUser) {
      return res.status(409).json({
        messages: "El email ya esta en uso",
      });
    }

    const nameUserExist = await Users.findOne({ nameUser });

    if (nameUserExist) {
      return res.status(409).json({
        messages: "El nombre de usuario ya esta en uso",
      });
    }
    const userInstance = new Users({
      nombre,
      apellido,
      nameUser,
      email,
      password,
      rol,
      clasificacion,
    });
    userInstance.password = await userInstance.encryptPassword(password);
    const user = await userInstance.save();

    
    return res.status(201).json(user);
  } catch (error) {
    console.error("Error en la creación de usuario:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const resetPassword = async (req: Request, res: Response): Promise<any> => {
  const { password, user, newPassword } = req.body;

  if (!user || !password || !newPassword) {
    return res.status(400).send({
      status: "error",
      message: "Email, password, y newPassword son requeridos",
    });
  }

  const query = isValidEmail(user) ? { email: user } : { nameUser: user };

  try {
    const userData = await Users.findOne(query);

    if (!userData) {
      res
        .json({
          status: "error",
          message: "Usuario no encontrado",
        })
        .status(404);
    }

    const match = await userData.matchPassword(password);

    if (match) {
      const hashedPassword = await userData.encryptPassword(newPassword);
      await Users.findOneAndUpdate(query, {
        password: hashedPassword,
        changePassword: false,
      });

      res.send({ status: "success", message: "Password change successful" });
    } else {
      res.status(201).send({
        status: "error",
        message: "El password no fue cambiado",
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Internal server error",
    });
  }
};

const login = async (req: Request, res: Response): Promise<any> => {
  const { username, password } = req.body;

  try {
    const userData = await Users.findOne({ nameUser: username });

    if (!userData) {
      return res.status(404).send({
        status: "error",
        message: "User not found",
      });
    }

    if (userData.status !== "activo") {
      return res.status(403).send({
        status: "error",
        message: "User not active",
      });
    }

    const match = await userData.matchPassword(password);

    if (!match) {
      return res.status(401).send({
        status: "error",
        message: "Incorrect password",
      });
    }

    const { nameUser, _id } = userData;
    const token = tokenGenerator({ nameUser, password, _id });

    const tokensInstance = new Tokens({
      token,
      active: true,
    });
    await tokensInstance.save();

    return res.send({
      status: "success",
      message: "Welcome!",
      data: userData,
      token,
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(e.code || 500).send({
      status: e.status || "error",
      message: e.message || "Internal server error",
    });
  }
};

const logout = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.headers;
  const dataTokens = await Tokens.findOne({ token });
  try {
    if (dataTokens.active) {
      await Tokens.findOneAndUpdate({ token }, { active: false });
      res.send({ status: "success", message: "logout!" });
    }
  } catch (e) {
    res
      .status(e.code || 500)
      .send({ status: e.status || "error", message: e.message });
  }
};

const verifyToken = async (req: Request, res: Response): Promise<any> => {
  const { token } = req.headers;
  const dataToken = await Tokens.findOne({ token });
  try {
    if (token) {
      if (dataToken !== null && dataToken.active) {
        jwt.verify(token as string, process.env.JWT_SECRET as string);
        res.send({
          status: "success",
          message: "Verified token",
        });
      } else {
        throw {
          code: 403,
          status: "error",
          message: "Expired token",
        };
      }
    } else {
      throw {
        code: 403,
        status: "error",
        message: "Missing header token",
      };
    }
  } catch (e) {
    res
      .status(e.code || 500)
      .send({ status: e.status || "error", message: e.message });
  }
};

const listUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const result = await Users.find().populate("rol", "name");
    if (result) {
      res.send({ status: true, data: result });
    } else {
      res.send({ status: false, message: "Users not found!" });
    }
  } catch (error) {
    res.status(error.code || 500).send({ status: false, message: error.message });
  }
};

const getUser = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.query;
  try {
    const dataUser = await Users.findById(userId);
    if (dataUser) {
      res.send({ status: "success", data: dataUser });
    } else {
      res.send({ status: "error", message: "User not found!" });
    }
  } catch (e) {
    res
      .status(e.code || 500)
      .send({ status: e.status || "error", message: e.message });
  }
};

const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { userId, dataUser } = req.body;
  try {
    const user = await Users.findByIdAndUpdate(userId, dataUser, { new: true });
    res.send({
      status: "success",
      message: "Successfully Updated User",
      DataUser: user,
    });
  } catch (error) {
    console.error("Error update:", error);
    res.status(500).send({
      status: "error",
      message: "Internal server error",
      isActive2FA: false,
    });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await Users.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send(error);
  }
};


export {
  create,
  login,
  listUsers,
  logout,
  verifyToken,
  resetPassword,
  getUser,
  updateUser,
  deleteUser,

};
