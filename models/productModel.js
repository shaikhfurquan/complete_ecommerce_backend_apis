import mongoose from 'mongoose';


const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        lowercase: true
    },
    slug: {
        type: String,
        required: [true, 'slug is required'],
        trim: true,
        lowercase: true
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        lowercase: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    brand: {
        type: String,
        required: [true, 'Brand is required'],
        enum: ['Apple', 'Samsung', 'Blackbery', 'Lenovo']
    },
    quantity: {
        type: Number,
        min: [0, 'Quantity must be a positive number'],
    },
    sold: {
        type: Number,
        default: 0
    },
    images: {
        type: Array
    },
    color: {
        type: String,
        enum: ['Black', 'White', 'Brown', 'Red']
    },
    ratings: [{
        star: Number,
        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
    }]
}, { timestamps: true });

const ProductModel = mongoose.model('Product', productSchema);

export { ProductModel }
