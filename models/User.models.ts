// models/User.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

type Rol = "admin" | "client";
type TypePlan = "premium" | "free";

// Interfaz para el documento de usuario
export interface IUser extends Document {
  username:string;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
  status: "activo" | "inactivo";
  plan: TypePlan;
  createdAt?: Date; // Generado automáticamente por `timestamps`
  updatedAt?: Date; // Generado automáticamente por `timestamps`

  // Métodos
  encryptPassword(password: string): Promise<string>;
  matchPassword(password: string): Promise<boolean>;
}

// Esquema para el usuario
const userSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, required: true,default:"client" },
    plan: {
      type: String,
      default: "free",
    },
    status: { type: String, default: "activo" },
  },
  { timestamps: true }
);

// Método para encriptar la contraseña
userSchema.methods.encryptPassword = async function (
  password: string
): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Método para comparar la contraseña
userSchema.methods.matchPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Modelo para el usuario
const User: Model<IUser> = mongoose.model<IUser>("users", userSchema);

export default User;
