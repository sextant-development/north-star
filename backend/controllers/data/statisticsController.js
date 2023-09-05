const asyncHandler = require('express-async-handler')

const User = require('../../models/userModel')
const Answer = require('../../models/answerModel')
const Questionnaire = require('../../models/questionnaireModel')
const { default: mongoose } = require('mongoose')


// Statistik dynamic
const statistics = asyncHandler(async (req, res, days) => {
    const user = req.user

    let results
    let userFilter
    const currentDate = new Date()
    const date = new Date(currentDate.getTime() - (days*24*60*60*1000))

    if (user.accessLevel == 1) {
        // SCHÜLER: Filter
        userFilter = {participant: new mongoose.Types.ObjectId(user.id)}
    } else {
        // LEHRER (herausfinden über beteiligte questionnaires)
        const questionnairesDB = await Questionnaire.find({publishTime: {$gt: date, $lt: new Date()}, author: user.id}, '_id')
        
        // Alle relevanten questionnaires in verarbeitbares Array packen
        const questionnaires = []
        questionnairesDB.forEach(q => {
            questionnaires.push(q._id)
        })

        // Filter erstellen
        userFilter = {questionnaire: {$in: questionnaires}}
    }


    const dateFilter = {"questionnaireObject.publishTime": {$gt: date, $lt: new Date()}}
    
    // AGGREGATE: $lookup: questionnaires einsetzen
    //            $match: alle falschen Antworten in Bezug auf Teilnehmer/Questionnaire-Ersteller (Schüler/Lehrer) aussortieren
    //            $match: nur Antworten innerhalb des dateFilters (letzte 30 Tage)
    //            $unwind: nach Tags aufdröseln
    //            $group: gleiche Tags am gleichen Datum gruppieren und Durschnitt bilden
    results = await Answer.aggregate([{$lookup: {from: "questionnaires", localField: "questionnaire", foreignField: "_id", as: "questionnaireObject"}}, 
                                        {$match: userFilter}, {$match: dateFilter}, {$unwind: "$tags" }, 
                                        {$group: {_id: {tag: "$tags", day: {$dayOfYear: {date: {$first: "$questionnaireObject.publishTime"}, timezone: "Europe/Berlin"}}}, value: {$avg: "$value"}}}
                                    ])


    const daysIntoYear = (Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()) - Date.UTC(currentDate.getFullYear(), 0, 0)) / 24 / 60 / 60 / 1000;
    
    // Statistik in vorgegebenes Format formatieren
    let stats = new Object()
    // Für jedes Ergebnis..
    results.forEach(result => {
        // ...den rückwärtszäählenden Tag berechnen
        const tag = result._id.tag
        const d = daysIntoYear - result._id.day
        if(d==30) return

        if(!stats.hasOwnProperty(tag)) {
            // Wenn Tag noch nicht hinzugefügt, initialisiere Tag
            stats[tag] = {}
        }
        stats[tag][d.toString()] = result.value
    });
    // Custom Date String
    stats.date = `${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()}`

    res.json(stats)
})

// Statistiken für letzte 30d
// GET /api/data/statistics/30d
// Private
const statistics30d = asyncHandler(async (req, res) => {
    statistics(req, res, 30)
})

// Statistiken für letztes Jahr
// GET /api/data/statistics/year
// Private
const statisticsYear = asyncHandler(async (req, res, next) => {
    const days = 365
    statistics(req, res, days)
})

// Statistiken für letztes Jahr mit detaillierten Reports (Groups)
// GET /api/data/statistics/year-details
// Private
const statisticsYearDetails = asyncHandler(async (req, res) => {

})

module.exports = {
    statistics30d,
    statisticsYear,
    statisticsYearDetails
}