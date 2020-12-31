const router = require('express').Router()
const axios = require('axios')
const { translateChunk, chunkContent } = require('../middleware')

// @method GET
// @route /api/languages
// @desc retrieves supported lagnguages
// @acces public
router.get('/', (req, res) => {
    axios({
        method: 'GET',
        url: 'https://microsoft-azure-microsoft-text-translation-3-0-v1.p.rapidapi.com/languages',
        headers: {
            'content-type': 'application/octet-stream',
            'x-rapidapi-host': 'microsoft-azure-microsoft-text-translation-3-0-v1.p.rapidapi.com',
            'x-rapidapi-key': process.env.RAPID_API_KEY,
            'accept': 'application/json'
        }, params: {
            'api-version': '3.0'
        }
    }).then(data => {
        res.json(data.data.translation)
    })
})

// @method POST 
// @route /api/languages/translate
// @desc translate file content and save to DB
// @access public
router.post('/translate', async (req, res) => {
    let { file, targetLangCode, targetLangName, translatedContent } = req.body

    let chunkedContent = chunkContent(file.content)
    let translatedChunks = []

    for (let chunk of chunkedContent) {
        let translatedChunk = await translateChunk(chunk, targetLangCode, file.textType)
        if (translatedChunk.message) return res.status(500).json({ message: 'Translation Failed - Please Check Server Logs For More Details' })
        translatedChunks.push(translatedChunk)
    }

    file.targetLangCode = targetLangCode
    file.targetLangName = targetLangName.split(' ')[1]
    file.translatedContent = translatedChunks.join()

    return res.status(200).json({ file })
})


module.exports = router