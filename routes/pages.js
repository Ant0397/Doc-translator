const router = require('express').Router()
const path = require('path')
const fs = require('fs')

// GET index
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages', 'index.html'))
})

// GET translation
router.get('/translation', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages', 'translation.html'))
})

module.exports = router
