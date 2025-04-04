import {Router} from 'express'
import { create,login,logout } from '../../controllers/users.controllers'
import { isAuth } from '../../middleware/auth';


const userRouter = Router()

userRouter.post("/create", create);
userRouter.get("/logout", isAuth,logout);
userRouter.post("/login", login);


export default userRouter