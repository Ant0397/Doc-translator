if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './config/local.env' })
}

// modules
const express = require('express')
const http = require('http')
const db = require('./config/db')

// app init
const app = express()
app.use(express.json())
app.use(express.static('public'))


// server setup
const PORT = process.env.PORT || 4000
http.createServer(app).listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port: ${PORT}`)
})

// DB
db.connectDB()

// routes
const fileRouter = require('./routes/file').router
app.use('/api/file', fileRouter)

const languagesRouter = require('./routes/languages')
app.use('/api/languages', languagesRouter)