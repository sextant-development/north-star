const mongoose = require('mongoose')

var questionnaireSchema = mongoose.Schema({
    author: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    publishTime: {type: Date, required: true},
    groups: {type: [String], required: true},
    questions: {type: String, required: true},
    answerCount: {type: Number, required: true}
}, {timestamps: true})

module.exports = mongoose.model('Questionnaire', questionnaireSchema)