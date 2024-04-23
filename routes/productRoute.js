import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthMiddleware.js';
import { createProduct, getaProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/create' , isAuthenticated , createProduct)
productRouter.get('/get/:productId' , getaProduct)


export default productRouter