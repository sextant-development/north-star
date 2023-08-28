const mongoose = require('mongoose')

var answerSchema = mongoose.Schema({
    participant: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    questionnaire: {type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Questionnaire'},
    tags: {type: [String], required: true},
    value: {type: Number, required: true}
}, {timestamps: true})

module.exports = mongoose.model('Answer', answerSchema)