const router = require('express').Router()
const path = require('path')

// @method GET
// @route /
// @desc serve index page
// @access public
router.get('/', async (req, res) => {
    return res.sendFile(path.join(__dirname, '../', 'public', 'index.html'))
})

// @method GET  
// @route /translation
// @desc serve index page
// @access public
router.get('/translation', (req, res) => {
    return res.sendFile(path.join(__dirname, '../', 'public', 'index.html'))
})

module.exports = router
