import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    category: {
        type: String,
        required: [true, 'Category is required']
    },
    brand: {
        type: String,
        required: [true, 'Brand is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be a positive number']
    },
    imageUrl: {
        type: String,
        required: [true, 'Image URL is required']
    }
} , {timestamps : true});

const ProductModel = mongoose.model('Product', productSchema);

export  {ProductModel}
