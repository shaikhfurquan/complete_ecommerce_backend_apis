import express from 'express';
import { deleteUser, getAllUsers, getSingleUser, loginUser, registerUser } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register' , registerUser)
userRouter.post('/login' , loginUser)
userRouter.get('/get-all' , getAllUsers)
userRouter.get('/get/:userId' , getSingleUser)
userRouter.delete('/delete/:userId' , deleteUser)


export default userRouter