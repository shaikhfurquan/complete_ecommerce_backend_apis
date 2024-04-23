import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthMiddleware.js';
import { createProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/create' , isAuthenticated , createProduct)


export default productRouter