import  mongoose from "mongoose"
import { MONGODB_URI } from "./config.js";


export const ConnectDb =async ()=>{
  try {
    await mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`DataBase is Connected! `);
  })
  .catch((err) => {
    console.log(err);
  });
  } catch (error) {
    console.log(error)
  }
  
}
