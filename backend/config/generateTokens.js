const jwt = require('jsonwebtoken')

const generateAccessToken = (id, accessLevel) => {
    return jwt.sign({id, accessLevel}, process.env.JWT_SECRET_ACCESS, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    })
}

const generateRefreshToken = (id, accessLevel) => {
    return jwt.sign({id, accessLevel}, process.env.JWT_SECRET_REFRESH, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION
    })
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}