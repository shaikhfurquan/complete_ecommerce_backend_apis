import slugify from "slugify"
import { ApiCatchResponse } from "../utils/ApiCatchResponse.js"
import { ApiSuccessResponse } from "../utils/ApiSuccessResponse.js"
import { ApiValidationResponse } from '../utils/ApiValidationResponse.js'
import { UserModel } from '../models/userModel.js'
import { ProductModel } from "../models/productModel.js"
import { validateMongoDbId } from "../utils/validateMongoDbId.js"


export const createProduct = async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await ProductModel.create(req.body)
        res.json({
            success: true,
            message: "Product created successfully",
            newProduct: newProduct
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while creating product', error.message)
    }
}


export const getaProduct = async (req, res) => {
    try {
        const { productId } = req.params
        validateMongoDbId(productId)
        const getaProduct = await ProductModel.findById(productId)
        res.json({
            success: true,
            message: "Product fetched successfully",
            getProduct: getaProduct
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while fetching product', error.message)
    }
}


export const getAllProducts = async (req, res) => {
    try {
        const getAllProducts = await ProductModel.find()
        res.json({
            success: true,
            message: "Products fetched successfully",
            allProductsCount: getAllProducts.length,
            allProducts: getAllProducts
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while fetching all products', error.message)
    }
}


export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId
        if (req.body.title) {
            req.body.slug = req.body.title
        }
        console.log(productId);
        const updateProduct = await ProductModel.findByIdAndUpdate( productId , req.body , { new: true })

        res.json({
            success: true,
            message: "Products updated successfully",
            updatedProduct: updateProduct
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while updating the product', error.message)
    }
}


export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId
        const deleteProduct = await ProductModel.findByIdAndDelete( productId )

        res.json({
            success: true,
            message: "Products deleted successfully",
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while deleting the product', error.message)
    }
}