import express from 'express';
import { isAdmin, isAuthenticated } from '../middlewares/isAuthMiddleware.js';
import { createProduct, deleteProduct, getAllProducts, getaProduct, updateProduct } from '../controllers/productController.js';

const productRouter = express.Router();


productRouter.post('/create', isAuthenticated, isAdmin, createProduct)

productRouter.get('/get/:productId', getaProduct)

productRouter.get('/get-all', getAllProducts)

productRouter.put('/update/:productId', isAuthenticated, isAdmin, updateProduct)

productRouter.delete('/delete/:productId', isAuthenticated, isAdmin, deleteProduct)


export default productRouter