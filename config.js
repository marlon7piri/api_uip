import dotenv from 'dotenv'
dotenv.config()


const env = process.env.NODE_ENV || 'development'

dotenv.config({
  path: env == 'production' ? '.env.production' : '.env.development'
})
export const PORT = process.env.PORT
export const MONGODB_URI = process.env.MONGO_URI

export const JWT_SECRET = process.env.JWT_SECRET
export const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
export const api_key = process.env.CLOUDINARY_API_KEY
export const api_secret = process.env.CLOUDINARY_API_SECRET
