const express = require('express')
const { addQuestionnaire, removeQuestionnaire } = require('../controllers/data/questionnaireController')
const { accessTokenProtection, accessLevelProtection } = require('../middleware/authMiddleware')

const router = express.Router()

// Schüler Routes


// Lehrer Routes
router.post('/questionnaires/add', accessTokenProtection, accessLevelProtection(2), addQuestionnaire)
router.delete('/questionnaires/remove', accessTokenProtection, accessLevelProtection(2),removeQuestionnaire)

module.exports = router