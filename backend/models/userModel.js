const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please add a name']},
    userName: {type: String, required: [true, 'Please add a user name'], unique: true},
    password: {type: String, required: [true, 'Please add a password']},
    email: {type: String},
    group: {type: String, required: [true, 'Please add a group']},
    accessLevel: {type: Number, required: [true, 'Please add an access Level']},
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)