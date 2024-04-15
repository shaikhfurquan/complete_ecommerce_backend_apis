import { ApiCatchResponse } from "../utils/ApiCatchResponse.js"
import { ApiSuccessResponse } from "../utils/ApiSuccessResponse.js"
import { ApiValidationResponse } from '../utils/ApiValidationResponse.js'
import { UserModel } from '../models/userModel.js'
import { logger } from "../utils/logger.js"
import { generateToken } from "../utils/generateToken.js"


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

        // removing the password from the response
        findUser.password = undefined

        const token = generateToken(findUser)
        // console.log(token);

        // logger.info('User login successfully')
        res.status(200).json({
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


export const getSingleUser = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) {
            return ApiValidationResponse(res, 'Please provide a user ID', 404)
        }

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
        if (error.name == 'CastError') {
            return ApiValidationResponse(res, 'Invalid Id', 400)
        }
        ApiCatchResponse(res, 'Error while a getting user', error.message)
    }
}


export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params
        if (!userId) {
            return ApiValidationResponse(res, 'Please provide a user ID', 404)
        }

        const user = await UserModel.findByIdAndDelete(userId)
        if (!user) {
            return ApiValidationResponse(res, 'User not found', 404)
        }
        res.status(200).json({
            success: true,
            message: `user deleted successfully`,
        })
    } catch (error) {
        if (error.name == 'CastError') {
            return ApiValidationResponse(res, 'Invalid Id', 400)
        }
        ApiCatchResponse(res, 'Error while a deleting user', error.message)
    }
}