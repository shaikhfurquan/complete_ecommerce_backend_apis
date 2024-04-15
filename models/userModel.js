import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required.'],
        minlength: [2, 'First name must be at least 2 characters long.'],
        maxlength: [50, 'First name cannot exceed 50 characters.']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required.'],
        minlength: [2, 'Last name must be at least 2 characters long.'],
        maxlength: [50, 'Last name cannot exceed 50 characters.']
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
        }
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        // unique: [true, 'Mobile number must be unique']
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [3, 'Password must be at least 3 characters long.']
    }
});


userSchema.pre('save' , async function(){
    this.password = await bcrypt.hash(this.password , 10)
})

userSchema.methods.isPasswordMatch = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword , this.password)
}

const UserModel = mongoose.model('User', userSchema);

export { UserModel }