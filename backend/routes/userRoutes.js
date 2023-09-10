const express = require('express')
const { registerUser, loginUser, getUser, changePassword } = require('../controllers/userController')
const { accessTokenProtection, refreshTokenProtection, accessLevelProtection } = require('../middleware/authMiddleware')
const newAccessToken = require('../controllers/tokenController')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/me', accessTokenProtection, getUser)
router.get('/refresh-access-token', refreshTokenProtection, newAccessToken)
router.post('/change-password', accessTokenProtection, changePassword)




// Beispiel für Verwendung von accessLevelProtection
// router.get('/1', accessTokenProtection, accessLevelProtection(1), (req, res) => res.json({'message': '1 funktioniert'}))

module.exports = router