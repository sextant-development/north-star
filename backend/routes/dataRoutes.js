const express = require('express')
const { getQuestionnaires, addQuestionnaire, removeQuestionnaire, getAvailableQuestionnaires, submitAnswer } = require('../controllers/data/questionnaireController')
const { accessTokenProtection, accessLevelProtection } = require('../middleware/authMiddleware')

const router = express.Router()

// Schüler Routes


// Lehrer Routes
router.get('/questionnaires/get', accessTokenProtection, accessLevelProtection(2), getQuestionnaires)
router.post('/questionnaires/add', accessTokenProtection, accessLevelProtection(2), addQuestionnaire)
router.delete('/questionnaires/remove', accessTokenProtection, accessLevelProtection(2),removeQuestionnaire)

// Schüler Routes
router.get('/questionnaires/available', accessTokenProtection, accessLevelProtection(1), getAvailableQuestionnaires)
router.post('/questionnaires/submit', accessTokenProtection, accessLevelProtection(1), submitAnswer)
module.exports = router