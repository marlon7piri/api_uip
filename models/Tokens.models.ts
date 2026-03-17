// models/Tokens.models.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interfaz para el documento de Tokens
export interface IToken extends Document {
  token: string;
  active: boolean;
  createdAt?: Date; // La fecha de creación es generada automáticamente por `timestamps`
  updatedAt?: Date; // La fecha de actualización es generada automáticamente por `timestamps`
  expireAt?: Date; // La fecha de actualización es generada automáticamente por `timestamps`
}

const tokensSchema: Schema<IToken> = new Schema(
  {
    token: { type: String, required: true },
    active: { type: Boolean, required: true },
    // El campo para que MongoDB lo borre solo (ejemplo: en 24h)
    expireAt: { type: Date, default: Date.now, expires: 86400 } 
  },
  { timestamps: true }
);

// Modelo para los tokens
const Token: Model<IToken> = mongoose.model<IToken>("tokens", tokensSchema);

export default Token;
