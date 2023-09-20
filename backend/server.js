const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const colors = require('colors')
const {connectDB} = require('./config/db')
const initializeFirebase = require('./config/firebase')
const errorHandler = require('./middleware/errorMiddleware')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 5000
const app = express()

// Initializing
initializeFirebase()
connectDB()

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// // For later use when switching databases
// app.use('/api/users', require('./middleware/userMiddleware'))
// app.use('/api/data', require('./middleware/dataMiddleware'))

app.use('/api/auth', require('./routes/userRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/data', require('./routes/dataRoutes'))

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,PUT,PATCH,POST,DELETE");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     console.log('hey')
//     next();
// });

app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`))
