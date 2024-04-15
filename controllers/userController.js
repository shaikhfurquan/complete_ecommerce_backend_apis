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

        // ApiSuccessResponse(res, 'User register successfully', newUser, 201)
        res.status(201).json({
            success : true,
            message : 'User registered successfully',
            user : newUser,
        })


    } catch (error) {
        // logger.error('Error while registering user', error.message , {error});
        ApiCatchResponse(res, 'Error while registering user', error.message)
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            logger.error('Email and password is required for login')
            return ApiValidationResponse(res, 'Email and password is required for login', 404)
        }

        // check user exists or not
        const findUser = await UserModel.findOne({ email })
        if (!findUser) {
            logger.error('User not found, register first')
            return ApiValidationResponse(res, 'User not found, register first', 404)
        }

        // compare given password with the hashed
        const isPasswordMatch = await findUser.isPasswordMatched(password)
        if(!isPasswordMatch){
            logger.error('Password mismatch')
            return ApiValidationResponse(res, 'Invalid credentials' , 404)
        }

        // removing the password from the response
        findUser.password = undefined

        const token = generateToken(findUser)
        // console.log(token);

        logger.info('User login successfully')
        // ApiSuccessResponse(res, `Welcome ${findUser.firstName}` , findUser, 200)
        res.status(200).json({
            success : true,
            message : `Welcome ${findUser.firstName}`,
            user : findUser,
            token
        })

    } catch (error) {
        logger.error('Error while login user', error.message, { error });
        ApiCatchResponse(res, 'Error while login user', error.message)
    }
}