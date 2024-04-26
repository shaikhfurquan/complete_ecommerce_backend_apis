import express from 'express';
import { isAuthenticated } from '../middlewares/isAuthMiddleware.js';
import { createProduct, getAllProducts, getaProduct, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();


productRouter.post('/create' , isAuthenticated , createProduct)

productRouter.get('/get/:productId' , getaProduct)

productRouter.get('/get-all' , getAllProducts)

productRouter.put('/update/:productId' , isAuthenticated ,  updateProduct)


export default productRouter