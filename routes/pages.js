const router = require('express').Router()
const path = require('path')
const fs = require('fs')
const File = require('../models/File')

// GET index
router.get('/', async (req, res) => {
    let files = await File.find()
    res.render('index', { files: files })
})

// GET translation
router.get('/translation', (req, res) => {
    res.render('translation')
})

module.exports = router
