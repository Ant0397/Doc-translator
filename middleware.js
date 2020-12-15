const File = require('./models/File')
const mammoth = require('mammoth')
const WordExtractor = require('word-extractor')
const extractor = new WordExtractor()

const findFile = async (req, res, next) => {
    let id = req.params.id || req.body.fileId
    let file = await File.findById(id)

    if (!file) return res.status(404).json('File not found')
    
    res.file = file
    next()
}

const extract = async (file) => {
    let { tempFilePath , name, mimetype } = file
    
    switch (mimetype) {
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return await mammoth.convertToHtml({path: tempFilePath}).then(data => { // use mammoth to convert .docx to HTML
                return {
                    'filename': name.split('.')[0],
                    'ext': name.split('.')[1],
                    'content': data.value,
                    'textType': 'html'
                }
            })

        case 'application/msword':
            return await extractor.extract(tempFilePath).then(data => { // use extractor to rip .doc content
                return {
                    'filename': name.split('.')[0],
                    'ext': name.split('.')[1],
                    'content': data.getBody(),
                    'textType': 'plain',
                }
            })
    }
}

exports.findFile = findFile
exports.extract = extract