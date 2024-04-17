import JWT from 'jsonwebtoken'

const generateRefreshToken = (user) => {
    try {
        const refreshToken = JWT.sign({_id : user._id}, process.env.JWT_REFRESH_SECRET, {expiresIn : process.env.JWT_REFRESH_EXPIRY})
        return refreshToken
    } catch (error) {
        console.log('Error generating refresh token', error.message);
    }
}

export { generateRefreshToken } 