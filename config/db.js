const mongoose = require('mongoose')
const File = require('../models/File')

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

const clearInProgress = () => { // removes files from DB that did not complete full translation process 
    try {
        const db = mongoose.connection
        db.once('open', async () => {
            const files = await File.find()
            for (const file of files ) {
                if (file.translatedContent == null) {
                    file.remove()
                }
            }
        })
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}

exports.connectDB = connectDB
exports.clearInProgress = clearInProgress