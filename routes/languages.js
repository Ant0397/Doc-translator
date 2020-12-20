const router = require('express').Router()
const axios = require('axios')
const { findFile, translateChunk, chunkContent } = require('../middleware')

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
router.post('/translate', findFile, async (req, res) => {
    let chunkedContent = chunkContent(req.file.content)
    let translatedChunks = []

    try {
        for (let chunk of chunkedContent) {
            let translatedChunk = await translateChunk(chunk, req.body.targetLangCode, req.file.textType)
            if (translatedChunk.message) return res.status(500).json({ message: 'Translation Failed - Please Check Server Logs For More Details' })
            translatedChunks.push(translatedChunk)
        }

        req.file.targetLangCode = req.body.targetLangCode
        req.file.targetLangName = req.body.targetLangName.split(' ')[1]
        req.file.translatedContent = translatedChunks.join()

        await req.file.save()
        return res.sendStatus(200)
    } catch (e) {
        return res.status(500).json({ message: e.message })
    }
})


module.exports = router