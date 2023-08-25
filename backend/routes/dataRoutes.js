const express = require('express')
const { addQuestionnaire } = require('../controllers/data/questionnaireController')

const router = express.Router()

router.post('/questionnaire', addQuestionnaire)

module.exports = router