import { tokenGenerator } from "../helpers/tokenGenerate.js";
import Tokens from "../models/Tokens.models.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { emailsNotifications } from "../utils/emailsNotifications.js";
import Users from "../models/User.models.js";

const isValidEmail = (email) => {
  const patron = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

  return patron.test(email);
};

const create = async (req, res) => {
  const { nameUser, email, password, rol, clasificacion } = req.body;

  const messages = [];

  try {
    const emailUser = await Users.findOne({ email });
    if (emailUser) {
      res.status(404).json({
        messages: "El email ya esta en uso",
      });
    }
    const userInstance = new Users({
      nameUser,
      email,
      password,
      rol,
      clasificacion,
    });
    userInstance.password = await userInstance.encryptPassword(password);
    const user = await userInstance.save();

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: error,
    });
  }
};

const resetPassword = async (req, res) => {
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
      res.status(201).send({
        status: "error",
        message: "Usuario no encontrado",
      });
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

const login = async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);

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

const logout = async (req, res) => {
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

const verifyToken = async (req, res) => {
  const { token } = req.headers;
  const dataToken = await Tokens.findOne({ token });
  try {
    if (token) {
      if (dataToken !== null && dataToken.active) {
        jwt.verify(token, process.env.JWT_SECRET);
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

const listUsers = async (req, res) => {
  try {
    const result = await Users.find().populate("rol", "name");
    if (result) {
      res.send({ status: true, data: result });
    } else {
      res.send({ status: false, message: "Users not found!" });
    }
  } catch (error) {
    res.status(e.code || 500).send({ status: false, message: e.message });
  }
};

const getUser = async (req, res) => {
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

const updateUser = async (req, res) => {
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

const deleteUser = async (req, res) => {
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

// Ruta para validar el código de verificación de email
const verifyEmail = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    // Buscar al usuario por el email
    const user = await Users.findOne({ email });

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Verificar si el código de verificación coincide
    if (user.emailVerificationCode === verificationCode) {
      // Si el código es correcto, actualiza el estado de verificación
      user.emailVerified = true;
      user.emailVerificationCode = null; // Limpiar el código después de usarlo
      await user.save();
      await emailNotifications.sendEmailBienvenida(user.email, user.nameUser);
      return res
        .status(200)
        .json({ message: "Correo verificado exitosamente." });
    } else {
      return res
        .status(400)
        .json({ error: "Código de verificación incorrecto." });
    }
  } catch (error) {
    console.error("Error verificando correo:", error);
    return res.status(500).json({ error: "Error verificando correo." });
  }
};

const verifyEmailPass = async (req, res) => {
  const { userid, verificationCode } = req.body;

  try {
    // Buscar al usuario por el email
    const user = await Users.findById(userid);

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    // Verificar si el código de verificación coincide
    if (user.emailVerificationCode === verificationCode) {
      // Si el código es correcto, actualiza el estado de verificación
      user.emailVerified = true;
      user.emailVerificationCode = null; // Limpiar el código después de usarlo
      await user.save();
      return res.status(200).json({ message: "verificado exitosamente." });
    } else {
      return res
        .status(400)
        .json({ error: "Código de verificación incorrecto." });
    }
  } catch (error) {
    console.error("Error verificando correo:", error);
    return res.status(500).json({ error: "Error verificando correo." });
  }
};

const resetAdminPassword = async (req, res) => {
  const { password, user, cnfPassword } = req.body;

  if (!user || !password || !cnfPassword) {
    return res.status(400).send({
      status: "error",
      message: "Email, password, y cnfPassword son requeridos",
    });
  }

  const query = isValidEmail(user) ? { email: user } : { _id: user };

  try {
    const userData = await Users.findOne(query);

    if (!userData) {
      res.status(201).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    const match = password === cnfPassword;

    if (match) {
      const hashedPassword = await userData.encryptPassword(password);
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

const requestResetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const userData = await Users.findOne({ email: email });

    if (!userData) {
      res.status(201).send({
        status: "error",
        message: "Usuario no encontrado",
      });
    }

    const codeEmail = await generateHexCode(10);
    userData.emailVerificationCode = codeEmail;
    await userData.save();

    await emailNotifications.sendEmailPassConfirmation(
      userData.email,
      process.env.EMAIL_PASS_VERIFICATION_URL + "/" + userData._id + codeEmail,
      userData.nameUser
    );
    res.send({ status: "success", message: "email sent  successful" });
  } catch (e) {
    res.status(500).send({ status: "error", message: e });
  }
};

async function generateHexCode(length) {
  return crypto.randomBytes(length).toString("hex").substr(0, length);
}
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
  verifyEmail,
  resetAdminPassword,
  verifyEmailPass,
  requestResetPassword,
};
