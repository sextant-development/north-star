const { default: mongoose } = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const { generateAccessToken, generateRefreshToken } = require('../config/generateTokens')
const User = require('../models/userModel')


// Register new User
// POST /api/auth/register
// Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, username, accessLevel } = req.body
    let groups
    try {
        groups = JSON.parse(req.body.groups)
    } catch (error) {
        res.status(400)
        throw new Error('Groups not working')
    }
    
    // Check for all fields
    if(!name || !username || !password || !accessLevel || groups.length === 0) {
        res.status(400)
        throw new Error('Please add all fields')
    }
    
    // Check if user exists
    const userExists = await User.findOne({username})
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
        accessLevel,
        lastRevokedTokenTime: ''
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
            accessToken: generateAccessToken(user.id, user.accessLevel),
            refreshToken: generateRefreshToken(user.id, user.accessLevel)
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }

})


// Login user
// POST /api/auth/login
// Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password, notificationToken } = req.body
    const user = await User.findOne({username})
    if(notificationToken) {
        user.notificationToken = notificationToken
        await user.save()
    }
    
    // Check if user and Password matching
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            groups: user.groups,
            accessLevel: user.accessLevel,
            accessToken: generateAccessToken(user.id, user.accessLevel),
            refreshToken: generateRefreshToken(user.id, user.accessLevel)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


// Get User Information
// GET /api/auth/me:id
// Private - Level 1
const getUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        name: req.user.name,
        username: req.user.username,
        email: req.user.email,
        groups: req.user.groups,
    })
})


module.exports = {
    registerUser,
    loginUser,
    getUser
}