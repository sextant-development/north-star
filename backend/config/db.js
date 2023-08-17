const { rmSync } = require('fs')
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_USER)
        console.log(`MongoDB connected: ${mongoose.connection.host}`.cyan.underline)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = {connectDB,}