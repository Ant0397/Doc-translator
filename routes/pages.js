const router = require('express').Router()
const File = require('../models/File')
const db = require('../config/db')
const findFile = require('./file').findFile

// GET index
router.get('/', async (req, res) => {
    await db.clearInProgress()
    const files = await File.find()
    res.render('index', { files: files })
})

// GET translation
router.get('/translation/:id', findFile, (req, res) => {
    res.render('translation', { file: res.file })
})

module.exports = router
