import { Request, Response } from "express";
import { tokenGenerator } from "../helpers/tokenGenerate";
import Tokens from "../models/Tokens.models";
import jwt from "jsonwebtoken";
import Users from "../models/User.models";
import { crearJugadorInicial } from "../utils/crearJugadorInicial";
import crypto from "crypto"; // Módulo nativo de Node.js

import Jugador from "models/Jugador.models";
import { transporter } from "config/mailer";

const isValidEmail = (email: string) => {
  const patron = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  return patron.test(email);
};

const forgotPassword = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body;

  try {
    const user = await Users.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // 1. Generar Token
    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    await user.save();

    // En tu controlador de Node.js
    const isDev = process.env.NODE_ENV === 'development';

    const resetLink = isDev
      ? `exp://192.168.0.8:8081/--/reset-password?token=${token}`
      : `ligastotal2://reset-password?token=${token}`;

    await transporter.sendMail({
      from: '"Soporte Técnico ⚽" <soporte@torneosapp.com>',
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2>Restablece tu contraseña</h2>
          <p>Hola ${user.nombre}, recibimos una solicitud para cambiar tu clave.</p>
          <p>Usa el siguiente enlace para crear una nueva:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #00D7C4; color: #000; text-decoration: none; border-radius: 5px;">
            Cambiar contraseña
          </a>
          <p>Si no fuiste tú, ignora este mensaje.</p>
        </div>
      `
    });

    return res.json({ status: "success", message: "Revisa tu bandeja de entrada en Mailtrap" });

  } catch (error) {
    console.error("Error en forgotPassword:", error);
    return res.status(500).json({ message: "Error al procesar la solicitud" });
  }
};
const confirmResetPassword = async (req: Request, res: Response): Promise<any> => {
  const { token, newPassword } = req.body;

  console.log({ token, newPassword })
  try {
    // Buscar usuario con el token y que no haya expirado
    const user = await Users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() } // $gt = mayor que ahora
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "El token es inválido o ha expirado"
      });
    }

    // Encriptar y guardar nueva contraseña
    user.password = await user.encryptPassword(newPassword);

    // Limpiar campos de recuperación
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    console.log(user)
    await user.save();

    return res.json({ status: "success", message: "Contraseña actualizada correctamente" });
  } catch (error) {
    return res.status(500).json({ status: "error", message: "Error interno" });
  }
};
const create = async (req: Request, res: Response): Promise<any> => {
  const { email, password, nombre, username } =
    req.body;
  try {
    const emailUser = await Users.findOne({ email });

    if (emailUser) {
      return res.status(409).json({
        messages: "El email ya esta en uso",
      });
    }



    const userInstance = new Users({
      nombre,
      username,
      email,
      password,
    });
    userInstance.password = await userInstance.encryptPassword(password);

    const newUser = {
      _id: userInstance._id,
      email: userInstance.email,
      nombre: nombre,
      userId: userInstance._id?.toString(),
    };

    const player = await crearJugadorInicial(newUser);

    if (player) {
      const user = await userInstance.save();
      return res.status(201).json(user);
    } else {
      await Jugador.findByIdAndDelete(player._id);
      return res.status(500).json({ message: "Error creando el usuario" });
    }
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
    const userData = await Users.findOne({ username });

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
      return res.status(401).json({ message: "Incorrect password" });
    }

    const { _id } = userData;
    const token = tokenGenerator({ _id });

    const tokensInstance = new Tokens({
      token,
      active: true,
    });
    await tokensInstance.save();
    const { password: _, ...userWithoutPassword } = userData.toObject();

    return res.send({
      status: "success",
      data: userWithoutPassword,
      token,
    });

  } catch (e) {
    console.error("Login error:", e);
    return res.status(e.code || 500).json({
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
    res
      .status(error.code || 500)
      .send({ status: false, message: error.message });
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
  forgotPassword,
  confirmResetPassword,
  login,
  listUsers,
  logout,
  verifyToken,
  resetPassword,
  getUser,
  updateUser,
  deleteUser,
};
