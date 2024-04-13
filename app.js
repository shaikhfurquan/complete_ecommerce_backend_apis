import express from 'express';
import dotenv from 'dotenv'

const app = express()
dotenv.config()


app.listen(process.env.PORT , ()=>{
    console.log(`Server started at ${process.env.PORT}`);
})