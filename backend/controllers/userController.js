const { default: mongoose } = require("mongoose")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


// Register new User
// POST /api/auth/register
// Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    // Check for all fields
    if(!name || !email || !password) {
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
        password: hashedPassword
    })

    // Send Result
    if(user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            accessToken: generateAccessToken(user.id),
            refreshToken: generateRefreshToken(user.id)
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
    const { email, password } = req.body
    const user = await User.findOne({email})

    // Check if user and Password matching
    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            accessToken: generateAccessToken(user.id),
            refreshToken: generateRefreshToken(user.id)
        })
    } else {
        res.status(400)
        throw new Error('Invalid credentials')
    }
})


// Get User Information
// GET /api/users/me:id
// Private
const getUser = asyncHandler(async (req, res) => {
    res.status(200).json({'message': 'Get'})
})


const generateAccessToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_ACCESS, {
        expiresIn: '30min'
    })
}

const generateRefreshToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET_REFRESH, {
        expiresIn: '365d'
    })
}


module.exports = {
    registerUser,
    loginUser,
    getUser
}