import express from 'express';
import dotenv from 'dotenv'
import morgan from 'morgan';
import { connectDB } from './db/connectDB.js';
import userRouter from './routes/userRoute.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import productRouter from './routes/productRoute.js';

const app = express()
dotenv.config()

//express middlewares
app.use(bodyParser.urlencoded({ extended : false}))
app.use(express.json())
app.use(cookieParser())
app.use(morgan('dev'))


// routes
app.use('/api/v1/users', userRouter)
app.use('/api/v1/products', productRouter)


// Database configuration
connectDB()

app.listen(process.env.PORT , ()=>{
    console.log(`Server started at ${process.env.PORT}`);
})