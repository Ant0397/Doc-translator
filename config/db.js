const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connected: ${connection.connection.host}`)

    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

module.exports = connectDB