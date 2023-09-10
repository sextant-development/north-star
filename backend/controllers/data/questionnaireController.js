const Questionnaire = require('../../models/questionnaireModel')
const User = require('../../models/userModel')
const Answer = require('../../models/answerModel')
const asyncHandler = require('express-async-handler')
const { default: mongoose } = require('mongoose')


//-----------------  TEACHERS  --------------------------------

// Get List of created Questionnaires (Teacher)
// GET /api/data/questionnaires/get
// Private - Level 2
const getQuestionnaires = asyncHandler(async (req, res) => {
    authorId = req.user.id

    const questionnaires = await Questionnaire.find({authorId})
    
    res.send(questionnaires)
})

// Add Questionnaire (Teacher)
// POST /api/data/questionnaires/add
// Private - Level 2
const addQuestionnaire = asyncHandler(async (req, res, next) => {
    // Extrac Information
    const { publishTime } = req.body
    const authorId = req.user.id

    let questions
    let groups
    let answerCount = 0
    try {
        questions = JSON.parse(req.body.questions)
        groups = JSON.parse(req.body.groups)
    } catch (error) {
        res.status(400)
        throw new Error('Questions or groups not working')
    }
    

    // Get required answerCount
    questions.forEach(question => {
        switch (question.type) {
            case 'fixed':
            case 'flexible':
                answerCount = answerCount + 1
                break;
            case 'dual':
                answerCount = answerCount + 2
                break
            case 'quad':
                answerCount = answerCount + 4
                break
            default:
                break;
        }
    });


    // Check all fields
    if(!publishTime || groups.length === 0 || questions.length === 0 || !answerCount) {
        res.status(400)
        throw new Error('Please add all fields.')
    }

    const questionnaire = await Questionnaire.create({
        author: authorId,
        publishTime,
        groups,
        questions: JSON.stringify(questions),
        answerCount
    })

    // Result rausschicken
    if(questionnaire) {
        res.send('Questionnaire got created')
    } else {
        res.status(400)
        throw new Error('Something went wrong.')
    }
    
    // Handling für Notification
    let notificationTokens = []
    const results = await User.aggregate([{$match: {groups: {$in: groups}}}])
    results.forEach((result) => {
        notificationTokens.push(result.notificationToken)
    })

    console.log(notificationTokens)

    const notification = {
        notification: {
            title: 'Neue Umfrage',
            body: `${req.user.name} hat eine neue Umfrage für dich erstellt`
        },
        tokens: notificationTokens,
    }
    req.notificationData = notification
    next()

})

// Remove Questionnaire (Teacher)
// DEL /api/data/questionnaire/remove
// Private - Level 2
const removeQuestionnaire = asyncHandler(async (req, res) => {
    const { id } = req.body
    if(!id) {
        res.status(400)
        throw new Error('Please provide ID.')
    }

    const result = await Questionnaire.deleteOne({ _id: id})

    if(result.acknowledged && result.deletedCount === 1) {
        res.send('Deleted successfully')
    } else {
        res.status(400)
        throw new Error('Questionnaire doesnt exist or already deleted')
    }
})



//------------------  Pupils  ---------------------------------

// Get all available Questionnaires specific groups of the user
// GET /api/data/questionnaires/available
// Private - Level 1
const getAvailableQuestionnaires = asyncHandler(async (req, res) => {
    const userGroups = req.user.groups

    const date = new Date(new Date().getTime() - (12*60*60*1000))
    let questionnaires = await Questionnaire.find({publishTime: {$gt: date, $lt: new Date()}, groups: {$in: userGroups}}).populate('author', 'name')

    console.log(JSON.stringify(questionnaires))
    res.send(JSON.stringify(questionnaires))
})

// Submit answer to questionnaire
// POST /api/data/questionnaires/submit
// Private - Level 1
const submitAnswer = asyncHandler(async (req, res) => {
    const { questionnaireId } = req.body
    let answers
    const id = req.user.id
    const userGroups = req.user.groups
    const questionnaire = await Questionnaire.findById({_id: questionnaireId})
    const questionnaireGroups = questionnaire.groups

    // Valid Answer Object?
    try {
        answers = JSON.parse(req.body.answers)
    } catch (error) {
        res.status(400)
        throw new Error('Wrong formatting of JSON Object')
    }

    // Alles vorhanden?
    if (!questionnaireId || !answers) {
        res.status(400)
        throw new Error('Please add all fields correctly.')
    }

    // Richtige Anzahl an Antoworten?
    if(answers.length != questionnaire.answerCount) {
        res.status(404)
        throw new Error('Wrong count of answers')
    }

    // Richtige Groups?
    if(!(userGroups.some((group) => questionnaireGroups.includes(group)))) {
        res.status(401)
        throw new Error('Wrong Group')
    }

    // Über alle Antoworten iterieren
    for (let i = 0; i < answers.length; i++) {
        const answer = answers[i]
        const answerDB = await Answer.create({
            participant: id,
            questionnaire: questionnaire.id,
            tags: answer.tags,
            value: answer.value
        })

        if(!answerDB) {
            res.status(400)
            throw new Error('Something went wrong')
        }

    }
    res.send('Answer got created')
})



module.exports = {
    getQuestionnaires,
    addQuestionnaire,
    removeQuestionnaire,
    getAvailableQuestionnaires,
    submitAnswer
}