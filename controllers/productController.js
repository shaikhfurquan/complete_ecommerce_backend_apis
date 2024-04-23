import { ApiCatchResponse } from "../utils/ApiCatchResponse.js"
import { ApiSuccessResponse } from "../utils/ApiSuccessResponse.js"
import { ApiValidationResponse } from '../utils/ApiValidationResponse.js'
import { UserModel } from '../models/userModel.js'
import { ProductModel } from "../models/productModel.js"
import { validateMongoDbId } from "../utils/validateMongoDbId.js"


export const createProduct = async (req, res) =>{
    try {
        const newProduct = await ProductModel.create(req.body)
        res.json({
            success : true,
            message : "Product created successfully",
            newProduct : newProduct
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while creating product', error.message)
    }
}


export const getaProduct = async (req, res) =>{
    try {
        const { productId} = req.params
        const getaProduct = await ProductModel.findById(productId)
        res.json({
            success : true,
            message : "Product fetched successfully",
            getProduct : getaProduct
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while fetching product', error.message)
    }
}