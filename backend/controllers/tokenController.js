const jwt = require('jsonwebtoken')

const newAccessToken = (req, res) => {
    res.json({
        accessToken: generateAccessToken(req.user.id)
    })
}


const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_ACCESS, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION
    })
}
module.exports = newAccessToken