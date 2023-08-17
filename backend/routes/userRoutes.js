const express = require('express')
const { registerUser, loginUser, getUser } = require('../controllers/userController')
const { accessTokenProtection, refreshTokenProtection } = require('../middleware/authMiddleware')
const newAccessToken = require('../controllers/tokenController')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', accessTokenProtection, getUser)
router.get('/newAccessToken', refreshTokenProtection, newAccessToken)

module.exports = router