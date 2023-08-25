const mongoose = require('mongoose')

var userSchema = mongoose.Schema({
    name: {type: String, required: [true, 'Please add a name']},
    username: {type: String, required: [true, 'Please add a user name'], unique: true},
    password: {type: String, required: [true, 'Please add a password']},
    email: {type: String},
    groups: {type: [String], required: [true, 'Please add groups']},
    accessLevel: {type: Number, required: [true, 'Please add an access Level']},
    lastRevokedTokenTime: {type: String}
}, {timestamps: true})

module.exports = mongoose.model('User', userSchema)