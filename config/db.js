const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connection = await mongoose.createConnection(process.env.DB_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDB connected: ${connection.db.databaseName}`)
        connection.db.collections()
        .then(data => console.log(`DB Collection: ${data[0].collectionName}`))
    } catch (e) {
        console.error(e)
        process.exit(1)
    }
}


module.exports = connectDB