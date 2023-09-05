const express = require('express')
const { getQuestionnaires, addQuestionnaire, removeQuestionnaire, getAvailableQuestionnaires, submitAnswer } = require('../controllers/data/questionnaireController')
const { accessTokenProtection, accessLevelProtection } = require('../middleware/authMiddleware')
const { statistics30d, statisticsYear, statisticsYearDetails } = require('../controllers/data/statisticsController')
const notificationHandler = require('../middleware/notificationMiddleware')

const router = express.Router()

// Schüler Routes


// Lehrer Routes
router.get('/questionnaires/get', accessTokenProtection, accessLevelProtection(2), getQuestionnaires)
router.post('/questionnaires/add', accessTokenProtection, accessLevelProtection(2), addQuestionnaire, notificationHandler)
router.delete('/questionnaires/remove', accessTokenProtection, accessLevelProtection(2),removeQuestionnaire)

// Schüler Routes
router.get('/questionnaires/available', accessTokenProtection, accessLevelProtection(1), getAvailableQuestionnaires)
router.post('/questionnaires/submit', accessTokenProtection, accessLevelProtection(1), submitAnswer)

// Statistik Routes
router.get('/statistics/30d', accessTokenProtection, accessLevelProtection(1), statistics30d)
router.get('/statistics/year', accessTokenProtection, accessLevelProtection(1), statisticsYear)
router.get('/statistics/year-details', accessTokenProtection, accessLevelProtection(1), statisticsYearDetails)




module.exports = router