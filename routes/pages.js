const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const File = require('../models/File')
const findFile = require('./file').findFile

// GET index
router.get('/', async (req, res) => {
    let files = await File.find()
    res.render('index', { files: files })
})

// GET translation
router.get('/translation/:id', findFile, (req, res) => {
    res.render('translation', { file: res.file })
})

module.exports = router
