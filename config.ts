import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

export const PORT = process.env.PORT;
export const MONGODB_URI = process.env.MONGO_URI;
export const CORS_ORIGIN = process.env.CORS_ORIGIN;

export const JWT_SECRET = process.env.JWT_SECRET;
export const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
export const api_key = process.env.CLOUDINARY_API_KEY;
export const api_secret = process.env.CLOUDINARY_API_SECRET;
