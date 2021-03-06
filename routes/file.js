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
// @desc extract file content and save to directory
// @access public
router.post('/upload', async (req, res) => {
    // if upload failed, abort
    if (fs.readdirSync(tempDirectory).length == 0) return res.status(500).json({ message: 'Upload Failed, Please Try Again' })
    
    // extract content
    let { file } = req.files
    let fileContent
    try {
        fileContent = await extract(file)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
    
    // delete temp file
    fs.unlinkSync(file.tempFilePath) 

    // return unsupported media status code if image tags are found
    if (fileContent.content.includes('<img')) return res.status(415).json({ message: 'Please Ensure Your File Does Not Contain Images' })

    // save to DB
    let newFile = new File(fileContent)
    try {
        await newFile.save()
        return res.status(201).json({ id: newFile._id, message: 'Select Language' })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

// @method GET
// @route /api/file/recent-files
// @desc get recently translated files 
// @access public
router.get('/recent-files', async (req, res) => {
    try {
        let files = await File.find()
        res.status(200).json({ files })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})

// @method GET
// @route /api/file/:id
// @desc get original and translated content 
// @access public
router.get('/:id', findFile, (req, res) => {
    let { content, translatedContent, targetLangName } = req.file
    return res.status(200).json({
        content,
        translatedContent,
        targetLangName
    })
})

// @method GET
// @route /api/file/create-doc/:id
// @desc converts html to docx and writes to directory 
// @access public
router.get('/create-doc/:id', findFile, async (req, res) => {
    let { filename, targetLangName, ext, textType, translatedContent } = req.file

    try {
        let name = `${filename} (${targetLangName}).${ext}`
        let filePath = path.join(tempDirectory, name)
        
        // create file and write to dir
        switch (textType) {
            case 'html':
                let blob = await HTMLtoDOCX(translatedContent)
                fs.writeFileSync(filePath, blob)
                break 

            case 'plain':
                fs.writeFileSync(filePath, translatedContent)
        }

        res.status(201).json({ path: filePath })
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})

// @method GET
// @route /api/file/download/:path
// @desc create word document and download
// @acces public
router.get('/download/:path',  (req, res) => {
        let filePath = req.params.path
        res.download(filePath)

        // clear /tmp directory 
        setTimeout(() => {
            fs.unlinkSync(filePath)
        }, 500)
})

// @method DELETE
// @route /api/file/:id
// @desc deletes file from db
// @access public
router.delete('/:id', findFile, async (req, res) => {
    try {
        await File.deleteOne({ _id: req.params.id })
        return res.sendStatus(204)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})


exports.router = router