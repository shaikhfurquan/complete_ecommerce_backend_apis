import { ApiCatchResponse } from "../utils/ApiCatchResponse.js"
import { ApiSuccessResponse } from "../utils/ApiSuccessResponse.js"
import { ApiValidationResponse } from '../utils/ApiValidationResponse.js'
import { UserModel } from '../models/userModel.js'
import { logger } from "../utils/logger.js"
import { generateToken } from "../utils/generateToken.js"
import { validateMongoDbId } from "../utils/validateMongoDbId.js"
import { generateRefreshToken } from "../utils/refreshToken.js"
import JWT from 'jsonwebtoken'


export const registerUser = async (req, res) => {
    try {
        // check if whether the user is already registered or not
        const { email } = req.body
        if (!email) {
            // logger.error('Email is required')
            return ApiValidationResponse(res, 'Email is required', 404)
        }
        const exisstingUser = await UserModel.findOne({ email })
        if (exisstingUser) {
            // logger.error('User already exists, Please login!');
            return ApiValidationResponse(res, 'Usre already exists, Please login!', 400)
        }
        const newUser = await UserModel.create(req.body)
        // logger.info('User registered successfully');

        // removing the password from the response
        newUser.password = undefined
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            newUser: newUser,
        })

        // ApiSuccessResponse(res, 'User register successfully', newUser, 201)

    } catch (error) {
        // logger.error('Error while registering user', error.message , {error});
        ApiCatchResponse(res, 'Error while registering user', error.message)
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            // logger.error('Email and password is required for login')
            return ApiValidationResponse(res, 'Email and password is required for login', 404)
        }

        // check user exists or not
        const findUser = await UserModel.findOne({ email })
        if (!findUser) {
            // logger.error('User not found, register first')
            return ApiValidationResponse(res, 'User not found, register first', 404)
        }

        // compare given password with the hashed
        const isPasswordMatch = await findUser.isPasswordMatched(password)
        if (!isPasswordMatch) {
            // logger.error('Password mismatch')
            return ApiValidationResponse(res, 'Invalid credentials', 404)
        }

        const refreshToken = await generateRefreshToken(findUser?._id)
        const updatedUser = await UserModel.findByIdAndUpdate(findUser?._id,
            { refreshToken: refreshToken }, { new: true })
        // removing the password from the response
        findUser.password = undefined

        const token = generateToken(findUser)
        // console.log(token);

        // logger.info('User login successfully')
        res.status(200).cookie("token", token, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 60 * 60 * 1000     // 3 days
        }).cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 5 * 24 * 60 * 60 * 1000       // 5 days
        }).json({
            success: true,
            message: `Welcome ${findUser.firstName}`,
            user: findUser,
            token
        })
        // ApiSuccessResponse(res, `Welcome ${findUser.firstName}` , findUser, 200)

    } catch (error) {
        // logger.error('Error while login user', error.message, { error });
        ApiCatchResponse(res, 'Error while login user', error.message)
    }
}


// handle refresh token
export const handleRefreshToken = async (req, res) => {
    try {
        const cookie = req.cookies
        // console.log(cookie);
        if (!cookie?.refreshToken) {
            throw new Error('No refresh token in cookies')
        }
        const refreshToken = cookie.refreshToken;
        // console.log('refreshToken', refreshToken);

        const user = await UserModel.findOne({ refreshToken })
        // console.log(user);
        if (!user) {
            throw new Error('No refresh token present in the db or not matched')
        }

        JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            // console.log("decoded --> _id" , decoded);
            if (err || user._id !== decoded._id) {
                throw new Error('There is something went wrong with the refresh token')
            }
        })

        const accessToken = generateToken(user?._id)
        console.log("accessToken", accessToken);
        res.status(200).json({
            success: true,
            accessToken: accessToken

        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while fetching refresh token with cookie', error.message)
    }
}


export const logoutUser = async (req, res) => {
    try {
        // console.log(req.cookies);
        const cookie = req.cookies;
        if (!cookie?.refreshToken) {
            throw new Error('No refresh token in cookies')
        }
        const refreshToken = cookie.refreshToken
        const user = await UserModel.findOne({ refreshToken })
        if (!user) {
            res.clearCookie('refreshToken', { httpOnly: true, secure: true })
                .clearCookie('token', { httpOnly: true, secure: true });
            res.sendStatus(204);
        }
        await UserModel.findOneAndUpdate({ refreshToken }, {
            refreshToken: ""
        })
        res.clearCookie('refreshToken', { httpOnly: true, secure: true })
            .clearCookie('token', { httpOnly: true, secure: true });

        res.status(200).json({
            success: true,
            message: "User log-out successfully"
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while logout user', error.message)
    }
}


export const updateUser = async (req, res) => {
    try {
        // console.log(req.user);
        const { _id } = req.user
        validateMongoDbId(_id)

        const updatedUser = await UserModel.findByIdAndUpdate(_id, {
            firstName: req?.body?.firstName,
            lastName: req?.body?.lastName,
            email: req?.body?.email,
            mobile: req?.body?.mobile
        }, { new: true })

        if (!updatedUser) {
            return ApiValidationResponse(res, 'User not found', 404)
        }
        res.status(200).json({
            success: true,
            message: `user updated successfully`,
            updatedUser: updatedUser
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while a updating user', error.message)
    }
}


export const getAllUsers = async (req, res) => {
    try {
        const getAllUsers = await UserModel.find().select("-password -email")
        if (!getAllUsers) {
            return ApiValidationResponse(res, 'Users not found', 404)
        }

        res.status(200).json({
            success: true,
            message: `Users fetch successfully`,
            allUsersCount: getAllUsers.length,
            allUsers: getAllUsers,
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while getting users', error.message)
    }
}


export const getMyProfile = async (req, res) => {
    try {
        const getMyProfile = await UserModel.findById(req.user._id).select("-password -email")
        if (!getMyProfile) {
            return ApiValidationResponse(res, 'Users not found', 404)
        }

        res.status(200).json({
            success: true,
            message: `Profile fetch successfully`,
            myProfile: getMyProfile
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while getting users', error.message)
    }
}


export const getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params
        validateMongoDbId(userId)

        const user = await UserModel.findById(userId).select("-password -email")
        if (!user) {
            return ApiValidationResponse(res, 'User not found', 404)
        }
        res.status(200).json({
            success: true,
            message: `${user.firstName} profile fetched successfully`,
            user: user,
        })
    } catch (error) {
        // if (error.name == 'CastError') {
        //     return ApiValidationResponse(res, 'Invalid Id', 400)
        // }
        ApiCatchResponse(res, 'Error while a getting user', error.message)
    }
}


export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        validateMongoDbId(userId)

        const user = await UserModel.findByIdAndDelete(userId)
        if (!user) {
            return ApiValidationResponse(res, 'User not found', 404)
        }
        res.status(200).json({
            success: true,
            message: `user deleted successfully`,
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while a deleting user', error.message)
    }
}


export const blockUser = async (req, res) => {
    try {
        const { userId } = req.params
        validateMongoDbId(userId)

        const user = await UserModel.findById(userId)
        if (user.isBlocked == true) {
            return ApiValidationResponse(res, 'User has already been blocked', 400)
        }

        const block = await UserModel.findByIdAndUpdate(userId,
            { isBlocked: true }, { new: true }
        ).select('-password')
        res.status(200).json({
            success: true,
            message: 'User blocked successfully',
            user: block
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while a blocking user', error.message)

    }
}


export const unblockUser = async (req, res) => {
    try {
        const { userId } = req.params
        validateMongoDbId(userId)

        const user = await UserModel.findById(userId)
        if (user.isBlocked == false) {
            return ApiValidationResponse(res, 'User has already been un-blocked', 400)
        }

        const unblock = await UserModel.findByIdAndUpdate(userId,
            { isBlocked: false }, { new: true }
        ).select('-password')
        res.status(200).json({
            success: true,
            message: 'User un-blocked successfully',
            user: unblock
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while a un-blocking user', error.message)
    }
}


export const updatePassword = async (req, res) => {
    const { _id } = req.user
    const { password } = req.body
    console.log(req.body);
    validateMongoDbId(_id)
    const user = await UserModel.findById(_id)
    if (!user) {
        return ApiValidationResponse(res, 'User not found', 400)
    }
    if (password) {
        user.password = password
        const updatedPassword = await user.save()
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
            updatedPassword: updatedPassword
        })
    } else {
        res.status(200).json({
            success: true,
            user: user
        })
    }
}

