const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const { registerUser } = require('./userController')

const revokeRefreshToken = asyncHandler(async (req, res) => {
    // TODO: Revoke User
    res.send('revoke User')
})

const updateDetails = asyncHandler(async (req, res) => {
    // TODO: Update User
    res.send('update Details')
})

const addUser = asyncHandler(async (req, res) => {
    // Für Einfachheit einfach Register Funktion:
    const { name, email, password, username, groups, accessLevel } = req.body
    // Check for all fields
    if(!name || !username || !password || !accessLevel || !groups) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    
    // Check if user exists
    const userExists = await User.findOne({email})
    if (userExists) {
        res.status(400)
        throw new Error('User already exists')
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        username,
        groups,
        accessLevel
    })

    // Send Result
    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            groups: user.groups,
            accessLevel: user.accessLevel,
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

const addUsers = asyncHandler(async (req, res) => {
    // TODO: Add Users
    res.send('add multiple Users')  
})

const removeUser = asyncHandler(async (req, res) => {
    // TODO: Remove Users
    username = req.body.username
    const result = await User.deleteOne({username})
    console.log(result)
    if (result.acknowledged && result.deletedCount == 1) {
        res.status(200)
        res.send('Deleted User')
    } else {
        res.status(400)
        res.send('User doesnt exist or already deleted')
    }
})

const removeUsers = asyncHandler(async (req, res) => {
    // TODO: Remove Users
    res.send('remove multiple Users')
})

const getNotifications = asyncHandler(async (req, res) => {
    // TODO: Get Notifications
    res.send('Here are your notifications')
})


module.exports = {
    revokeRefreshToken,
    updateDetails,
    addUser,
    addUsers,
    removeUser,
    removeUsers,
    getNotifications
}