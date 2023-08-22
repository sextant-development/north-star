const express = require('express')
const { revokeToken, updateDetails, addUser, addUsers, removeUser, removeUsers, getNotifications} = require('../controllers/adminController')
const { accessTokenProtection, accessLevelProtection} = require('../middleware/authMiddleware')

const router = express.Router()

router.post('/revoke-token', accessTokenProtection, accessLevelProtection(4), revokeToken)
router.patch('/update-details', accessTokenProtection, accessLevelProtection(4), updateDetails)
router.post('/add-user', accessTokenProtection, accessLevelProtection(4), addUser)
router.post('/add-users', accessTokenProtection, accessLevelProtection(4), addUsers)
router.delete('/remove-user', accessTokenProtection, accessLevelProtection(4), removeUser)
router.delete('/remove-users', accessTokenProtection, accessLevelProtection(4), removeUsers)
router.get('/notifications', accessTokenProtection, accessLevelProtection(4), getNotifications)


module.exports = router