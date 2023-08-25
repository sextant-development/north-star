const mongoose = require('mongoose')

var answerSchema = mongoose.Schema({
    participantId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    questionnaireId: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Questionnaire'},
    tags: {type: [String], required: true},
    value: {type: Number, required: true}
}, {timestamps: true})

module.exports = mongoose.model('Answer', answerSchema)