import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.'],
        minlength: [2, 'First name must be at least 2 characters long.'],
        maxlength: [50, 'First name cannot exceed 50 characters.'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        minlength: [2, 'Last name must be at least 2 characters long.'],
        maxlength: [50, 'Last name cannot exceed 50 characters.'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: [true, 'Email must be unique.'],
        validate: {
            validator: function (value) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: 'Please enter a valid email address.'
        },
        trim: true,
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        // unique: [true, 'Mobile number must be unique'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [3, 'Password must be at least 3 characters long.'],
        trim: true,
    },
    role : {
        type : String,
        enum : ['admin', 'user'] ,
        default : "user"
    },
    isBlocked : {
        type : Boolean,
        default : false
    },
    cart : {
        type : Array,
        default : []
    },
    address : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Address"
    },
    wishlist : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Product"
    },
    refreshToken : {
        type : String,
    },
    passwordChangeAt : Date,
    passwordResetToken : String,
    passwordResetExpires : Date,
} , {timestamps : true});


userSchema.pre('save', async function (next) {
    if(!this.isModified("password")){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordMatched = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.methods.createPasswordResetToken = async function (){
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000
    return resetToken
}
const UserModel = mongoose.model('User', userSchema);

export { UserModel }