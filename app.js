import express from 'express';
import dotenv from 'dotenv'
import { connectDB } from './db/connectDB.js';

const app = express()
dotenv.config()

// Database configuration
connectDB()

app.listen(process.env.PORT , ()=>{
    console.log(`Server started at ${process.env.PORT}`);
})