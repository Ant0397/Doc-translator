const File = require('./models/File')
const mammoth = require('mammoth')
const WordExtractor = require('word-extractor')
const extractor = new WordExtractor()
const axios = require('axios')
const { v4: uuidv4 } = require('uuid')

const findFile = async (req, res, next) => {
    let id = req.params.id || req.body.fileId
    try {
        let file = await File.findById(id)
        if (!file) return res.status(404).json({ message: 'File Not Found' })
        
        req.file = file
        next()
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
}

const extract = async (file) => {
    let { tempFilePath , name, mimetype } = file
    
    switch (mimetype) {
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            return await mammoth.convertToHtml({path: tempFilePath}).then(data => { // use mammoth to convert .docx to HTML
                return {
                    'id': uuidv4(),
                    'targetLangCode': '',
                    'targetLangName': '',
                    'translatedContent': '',
                    'filename': name.split('.')[0],
                    'ext': name.split('.')[1],
                    'content': data.value,
                    'textType': 'html'
                }
            })

        case 'application/msword':
            return await extractor.extract(tempFilePath).then(data => { // use extractor to rip .doc content
                return {
                    'id': uuidv4(),
                    'targetLangCode': '',
                    'targetLangName': '',
                    'translatedContent': '',
                    'filename': name.split('.')[0],
                    'ext': name.split('.')[1],
                    'content': data.getBody(),
                    'textType': 'plain',
                }
            })
    }
}

const translateChunk = (chunk, language, textType) => {
    return axios({
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'x-rapidapi-host': 'microsoft-azure-microsoft-text-translation-3-0-v1.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY,
        }, params: {
            'textType': textType,
            'to': language,        
            'api-version': '3.0'
        }, data: [{
            'Text': chunk
        }]
    }).then(data => {
        return data.data[0].translations[0].text
    }).catch(e => {
        return e
    })
}

const chunkContent = (value) => { // separates file content into chunks of 5000 characters (API request limit)
    if (value.length < 4999) {
        return [value]
    } else {
        return value.match(new RegExp('.{1,' + 4999 + '}', 'g'))
    }
} 


exports.findFile = findFile
exports.extract = extract
exports.translateChunk = translateChunk
exports.chunkContent = chunkContent