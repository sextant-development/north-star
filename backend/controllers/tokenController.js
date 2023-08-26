const jwt = require('jsonwebtoken')
const { generateAccessToken } = require('../config/generateTokens')

// Return new Access Token
// GET /api/auth/refresh-access-token
// Private (refresh) - Level 1
const newAccessToken = (req, res) => {
    res.json({
        accessToken: generateAccessToken(req.user.id, req.user.accessLevel)
    })
}

module.exports = newAccessToken