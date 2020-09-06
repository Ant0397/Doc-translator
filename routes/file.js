const router = require('express').Router()
const path = require('path')
const upload = require('express-fileupload')
const mammoth = require('mammoth')
const WordExtractor = require('word-extractor')
const extractor = new WordExtractor()
const HTMLtoDOCX = require('html-to-docx')
const fs = require('fs')
const File = require('../models/File')

// middleware
const tempDirectory = path.join(__dirname, '../', 'tmp')
router.use(upload({
    useTempFiles: true,
    tempFileDir: tempDirectory
}))

const findFile = async (req, res, done) => {
    let id = req.params.id || req.body.fileId
    let file = await File.findById(id)

    if (! file) {
        res.status(404).json('File not found')
    } else {
        res.file = file
        done()
    }
}

// POST extract file content and upload to DB
router.post('/upload', async (req, res) => {
    if (fs.readdirSync(tempDirectory).length == 0) { // if upload failed, abort
        res.sendStatus(500)
    } else {
        let fileContent
        switch (req.files.file.mimetype) {

            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                fileContent = await mammoth.convertToHtml({path: req.files.file.tempFilePath}).then(data => { // use mammoth to convert .docx to HTML
                    return {
                        'filename': req.files.file.name.split('.')[0],
                        'ext': req.files.file.name.split('.')[1],
                        'content': data.value,
                        'textType': 'html'
                    }
                })
                break

            case 'application/msword':
                fileContent = await extractor.extract(req.files.file.tempFilePath).then(data => { // use extractor to rip .doc content
                    return {
                        'filename': req.files.file.name.split('.')[0],
                        'ext': req.files.file.name.split('.')[1],
                        'content': data.getBody(),
                        'textType': 'plain',
                    }
                })
                break
        }

        fs.unlinkSync(req.files.file.tempFilePath) // delete temp file

        if (fileContent.content.includes('<img')) { // return unsupported media status code
            res.sendStatus(415)
        } else { // save to DB
            let file = new File(fileContent)
            try {
                file.save()
                res.status(201).json(file.id)
            } catch (e) {
                res.status(500).json({ message: e.message })
            }
        }
    }
})

// GET create document and download
router.get('/download/:id', findFile, async (req, res) => {
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
        }, 5000)
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