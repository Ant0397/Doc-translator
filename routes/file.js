// modules
const router = require('express').Router()
const path = require('path')
const upload = require('express-fileupload')
const HTMLtoDOCX = require('html-to-docx')
const fs = require('fs')
const File = require('../models/File')
const { findFile, extract } = require('../middleware')

// directory 
const tempDirectory = path.join(__dirname, '../', 'tmp')
router.use(upload({
    useTempFiles: true,
    tempFileDir: tempDirectory
}))


// @method POST 
// @route /api/file/upload
// @desc extract file content and upload to DB
// @access public
router.post('/upload', async (req, res) => {
    // if upload failed, abort
    if (fs.readdirSync(tempDirectory).length == 0) return res.status(500).json({ message: 'Upload Failed, Please Try Again' })
    
    // extract content
    let { file } = req.files
    let fileContent = await extract(file)
    
    // delete temp file
    fs.unlinkSync(file.tempFilePath) 

    // return unsupported media status code
    if (fileContent.content.includes('<img')) return res.status(415).json({ message: 'Please Ensure Your File Does Not Contain Images' })

    // save to DB
    let newFile = new File(fileContent)
    try {
        await newFile.save()
        return res.status(201).json({ id: newFile._id, message: 'Select Target Language' })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

// GET create document and download
router.get('/download/:id', findFile, async (req, res) => {
    try {
        let name = `${res.file.filename} (${res.file.targetLang}).${res.file.ext}`
        let filePath = path.join(tempDirectory, name)
        switch (res.file.textType) {
            case 'html':
                let blob = await HTMLtoDOCX(res.file.translatedContent)
                fs.writeFileSync(filePath, blob)
                break 

            case 'plain':
                fs.writeFileSync(filePath, res.file.translatedContent)
        }
        
        res.download(filePath)

        setTimeout(() => {
            fs.unlinkSync(filePath) // clear /tmp directory
        }, 500)
    } catch (e) {
        res.end(e)
    }
})

router.get('/delete/:id', findFile, (req, res) => {
    res.file.delete()
    res.sendStatus(200)
})

// GET file content
router.get('/content/:id', findFile, (req, res) => {
    res.json(res.file)
})


exports.router = router
exports.findFile = findFile