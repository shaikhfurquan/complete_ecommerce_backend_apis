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
        // const startTime = performance.now(); // Start measuring time
        // const getAllProducts = await ProductModel.find();
        // const endTime = performance.now(); // End measuring time
        // const executionTime = endTime - startTime; // Calculate execution time in milliseconds
        
        // Filtering
        const queryObject = { ...req.query }
        const excludeFields = ["page" , "sort" , "limit" , "fields"]
        excludeFields.forEach((elem) => delete queryObject[elem])
        // console.log(queryObject);   // { price: { gte: '100' } }
        

        // console.log("modified==>",queryObject ,"original==>" ,req.query);
        // modified==> { brand: 'hp', category: 'watch' } 
        // original==> { brand: 'hp', category: 'watch', sort: 'price' }

        let queryStr = JSON.stringify(queryObject); // '{"price":{"gte":10}}'
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // console.log(JSON.parse(queryStr));  //{ price: { '$gte': '100' } }

        let query = ProductModel.find(JSON.parse(queryStr));

        // Sorting
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query =  query.sort(sortBy)
        }else{
            query = query.select('-createdAt')
        }


        // Limiting
        if(req.query.fields){
            const fields = req.query.fields.split(",").join(" ")
            query = query.select(fields)
        }else{
            query = query.select('__v')
        }


        // Pagination
        const page = req.query.page || 1
        const limit = req.query.limit || 10
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        console.log(page, limit, skip);
        if(req.query.page){
            const productCount = await ProductModel.countDocuments()
            if(skip >= productCount) throw new Error("This page doesn't exist")
        }

        const product = await ProductModel.find(query).collation({ locale: 'en', strength: 2 })
        res.json({
            success: true,
            message: "Products fetched successfully",
            productCount: product.length,
            product: product
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while fetching products', error.message)
    }
}


export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.productId
        validateMongoDbId(productId)
        if (req.body.title) {
            req.body.slug = req.body.title
        }
        // console.log(productId);

        const updateProduct = await ProductModel.findByIdAndUpdate(productId, req.body, { new: true })

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
        validateMongoDbId(productId)
        const deleteProduct = await ProductModel.findByIdAndDelete(productId)

        res.json({
            success: true,
            message: "Products deleted successfully",
        })
    } catch (error) {
        ApiCatchResponse(res, 'Error while deleting the product', error.message)
    }
}