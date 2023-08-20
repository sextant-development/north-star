const jwt = require('jsonwebtoken')
const { generateAccessToken } = require('../config/generateTokens')

const newAccessToken = (req, res) => {
    res.json({
        accessToken: generateAccessToken(req.user.id, req.user.accessLevel)
    })
}

module.exports = newAccessToken