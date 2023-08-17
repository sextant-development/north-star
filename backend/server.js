const express = require('express')
const mongoose = require('mongoose')
const colors = require('colors')
const {connectDB} = require('./config/db')
const errorHandler = require('./middleware/errorMiddleware')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

connectDB()


app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use('/api/users', require('./middleware/userMiddleware'))

app.use('/api/auth', require('./routes/userRoutes'))


app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
