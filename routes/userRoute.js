import express from 'express';
import { blockUser, deleteUser, getAllUsers, getMyProfile, getSingleUser, handleRefreshToken, loginUser, logoutUser, registerUser, unblockUser, updateUser } from '../controllers/userController.js';
import { isAdmin, isAuthenticated } from '../middlewares/isAuthMiddleware.js';

const userRouter = express.Router();

userRouter.post('/register' , registerUser)

userRouter.post('/login' , loginUser)

userRouter.get('/get-all' , getAllUsers)

userRouter.get('/get/:userId' ,isAuthenticated , isAdmin , getSingleUser)

userRouter.get('/my-profile' , isAuthenticated , getMyProfile)

userRouter.delete('/delete/:userId' , deleteUser)

userRouter.get('/refresh', handleRefreshToken)

userRouter.get('/logout' , isAuthenticated , logoutUser)

userRouter.put('/update', isAuthenticated , updateUser)
userRouter.put('/block-user/:userId', isAuthenticated , isAdmin, blockUser)
userRouter.put('/unblock-user/:userId', isAuthenticated , isAdmin, unblockUser)


export default userRouter
