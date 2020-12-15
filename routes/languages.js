const router = require('express').Router()
const axios = require('axios')
const findFile = require('./file').findFile

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

// POST translate
router.post('/translate', findFile, async (req, res) => {
    let chunkedContent = chunkContent(res.file.content)
    let translatedChunks = []

    for (let chunk of chunkedContent) {
        let translatedChunk = await translateChunk(chunk, req.body.language, res.file.textType)
        translatedChunks.push(translatedChunk)
    }
    
    try {
        res.file.targetLang = req.body.nativeName
        res.file.translatedContent = translatedChunks.join()
        res.file.save()
        res.sendStatus(200)
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
})


async function translateChunk(chunk, language, textType) 
{
    return await axios({
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json',
            'x-rapidapi-host': 'microsoft-translator-text.p.rapidapi.com',
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
        console.log(e.response)
    })
}

function chunkContent(value) // separates file content into chunks of 5000 characters (API request limit)
{
    if (value.length < 4999) {
        return [value]
    } else {
        return value.match(new RegExp('.{1,' + 4999 + '}', 'g'))
    }
}


module.exports = router