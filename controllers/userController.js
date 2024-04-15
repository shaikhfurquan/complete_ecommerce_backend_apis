import { ApiCatchResponse } from "../utils/ApiCatchResponse.js"
import { ApiSuccessResponse } from "../utils/ApiSuccessResponse.js"
import { ApiValidationResponse } from '../utils/ApiValidationResponse.js'
import { UserModel } from '../models/userModel.js'
import { logger } from "../utils/logger.js"


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

        ApiSuccessResponse(res, 'User register successfully', newUser, 201)

    } catch (error) {
        // logger.error('Error while registering user', error.message , {error});
        ApiCatchResponse(res, 'Error while registering user', error.message)
    }
}
