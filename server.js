if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({ path: './config/config.env' })
}

// modules
const express = require('express')
const http = require('http')
const connectDB = require('./config/db')

// app init
const app = express()
app.use(express.json())
app.use(express.static('public'))


// server setup
const PORT = process.env.PORT || 4000
http.createServer(app).listen(PORT, () => {
    console.log(`Server Running in ${process.env.NODE_ENV} on port: ${PORT}`)
})

// DB
connectDB()

// routes
const pagesRouter = require('./routes/pages')
app.use('/', pagesRouter)

const fileRouter = require('./routes/file').router
app.use('/file', fileRouter)

const languagesRouter = require('./routes/languages')
app.use('/languages', languagesRouter)