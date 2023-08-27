const Questionnaire = require('../../models/questionnaireModel')
const Answer = require('../../models/answerModel')
const asyncHandler = require('express-async-handler')



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
const addQuestionnaire = asyncHandler(async (req, res) => {
    // Extrac Information
    const { publishTime } = req.body
    const authorId = req.user.id
    console.log(authorId)
    let questions
    let groups
    try {
        questions = JSON.parse(req.body.questions)
        groups = JSON.parse(req.body.groups)
    } catch (error) {
        res.status(400)
        throw new Error('Questions or groups not working')
    }

    // Check all fields
    if(!publishTime || groups.length === 0 || questions.length === 0) {
        res.status(400)
        throw new Error('Please add all fields.')
    }

    const questionnaire = await Questionnaire.create({
        authorId,
        publishTime,
        groups,
        questions
    })
    if(questionnaire) {
        res.send('Questionnaire got created')
    } else {
        res.status(400)
        throw new Error('Something went wrong.')
    }

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
    const groups = req.user.groups
    let questionnaires = []
    
    
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        const results = await Questionnaire.find({groups: group})
        
        for (let j = 0; j < results.length; j++) {
            const result = results[j]
            questionnaires.push(result)
        }
    }
    console.log(questionnaires)
    res.json(questionnaires)
})

// Submit answer to questionnaire
// POST /api/data/questionnaires/submit
// Private - Level 1
const submitAnswer = asyncHandler(async (req, res) => {
    const { questionnaireId } = req.body
    let answers
    const id = req.user.id
    const questionnaire = await Questionnaire.findById({_id: questionnaireId})

    try {
        answers = JSON.parse(req.body.answers)
    } catch (error) {
        res.status(400)
        throw new Error('Wrong formatting of JSON Object')
    }

    if (!questionnaireId || !answers || ) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    const answer = await Answer.create({
        participantId: id,
        questionnaireId,
        tags,
        value
    })

    if(answer) {
        res.send('Answer got created')
    } else {
        res.status(400)
        throw new Error('Something went wrong')
    }
})



module.exports = {
    getQuestionnaires,
    addQuestionnaire,
    removeQuestionnaire,
    getAvailableQuestionnaires,
    submitAnswer
}