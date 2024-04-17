import { ApiCatchResponse } from "../utils/ApiCatchResponse.js"
import { ApiSuccessResponse } from "../utils/ApiSuccessResponse.js"
import { ApiValidationResponse } from '../utils/ApiValidationResponse.js'
import { UserModel } from '../models/userModel.js'
import { logger } from "../utils/logger.js"
import { generateToken } from "../utils/generateToken.js"
import JWT from 'jsonwebtoken'


// Auth middleware
const isAuthenticated = async (req, res, next) => {
    try {
        // console.log("req.headers", req.headers);
        // console.log(req.cookies);
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(" ")[1]);
        // console.log("token", token);

        if (token) {
            const decodedUser = JWT.verify(token, process.env.JWT_SECRET)
            // console.log("decoded user", decodedUser);
            const findUser = await UserModel.findById(decodedUser?._id)
            // console.log("user", user);

            req.user = findUser
            // console.log(findUser);
            next()
        } else {
            return ApiValidationResponse(res, 'Token required', 404)
        }

    } catch (error) {
        ApiCatchResponse(res, "Error while authenticating user", error.message)
    }
}


// Admin middleware
const isAdmin = async (req, res, next) => {
    try {
        // console.log(req.user);
        if(req.user.role !== 'admin') {
            return ApiValidationResponse(res , 'You are not allowed, Admin is not allowed' , 400)
        }else{
            next()
        }

    } catch (error) {
        ApiCatchResponse(res, "Error while authenticating admin", error.message)
    }
}

export { isAuthenticated , isAdmin}