const express = require('express')
const { addQuestionnaire } = require('../controllers/data/questionnaireController')
const { accessTokenProtection } = require('../middleware/authMiddleware')

const router = express.Router()

// Schüler Routes


// Lehrer Routes
router.post('/questionnaires/add', accessTokenProtection, addQuestionnaire)

module.exports = router