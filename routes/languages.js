const router = require('express').Router()
const axios = require('axios')
const { findFile, translateChunk, chunkContent } = require('../middleware')

// @method GET
// @route /api/languages
// @desc retrieves supported lagnguages
// @acces public
router.get('/', (req, res) => {

    // axios({
    //     method: 'GET',
    //     url: 'https://microsoft-azure-microsoft-text-translation-3-0-v1.p.rapidapi.com/languages',
    //     headers: {
    //         'content-type': 'application/octet-stream',
    //         'x-rapidapi-host': 'microsoft-azure-microsoft-text-translation-3-0-v1.p.rapidapi.com',
    //         'x-rapidapi-key': process.env.RAPID_API_KEY,
    //         'accept': 'application/json'
    //     }, params: {
    //         'api-version': '3.0'
    //     }
    // }).then(data => {
    //     res.json(data.data.translation)
    // })

    let languages = {
        af: {name: "Afrikaans", nativeName: "Afrikaans", dir: "ltr"},
        ar: {name: "Arabic", nativeName: "العربية", dir: "rtl"},
        bg: {name: "Bulgarian", nativeName: "Български", dir: "ltr"},
        bn: {name: "Bangla", nativeName: "বাংলা", dir: "ltr"},
        bs: {name: "Bosnian", nativeName: "bosanski (latinica)", dir: "ltr"},
        ca: {name: "Catalan", nativeName: "Català", dir: "ltr"},
        cs: {name: "Czech", nativeName: "Čeština", dir: "ltr"},
        cy: {name: "Welsh", nativeName: "Welsh", dir: "ltr"},
        da: {name: "Danish", nativeName: "Dansk", dir: "ltr"},
        de: {name: "German", nativeName: "Deutsch", dir: "ltr"},
        el: {name: "Greek", nativeName: "Ελληνικά", dir: "ltr"},
        en: {name: "English", nativeName: "English", dir: "ltr"},
        es: {name: "Spanish", nativeName: "Español", dir: "ltr"},
        et: {name: "Estonian", nativeName: "Eesti", dir: "ltr"},
        fa: {name: "Persian", nativeName: "Persian", dir: "rtl"},
        fi: {name: "Finnish", nativeName: "Suomi", dir: "ltr"},
        fil: {name: "Filipino", nativeName: "Filipino", dir: "ltr"},
    }

    res.json(languages)
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
            if (translatedChunk.message) return res.status(500).json({ message: translatedChunk.message })
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