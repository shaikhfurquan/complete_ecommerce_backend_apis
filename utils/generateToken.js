import JWT from 'jsonwebtoken'

const generateToken = (user) => {
    try {
        const token = JWT.sign({_id : user._id}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_EXPIRY})
        return token
    } catch (error) {
        console.log('Error generating token', error.message);
    }
}

export { generateToken } 