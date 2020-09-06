const mongoose = require('mongoose')

const FileSchema = new mongoose.Schema({
    "filename": {
        type: String,
        required: true,
    },
    "ext": {
        type: String,
        required: true
    },
    "content": {
        type: String,
        required: true
    },
    "textType": {
        type: String,
        required: true
    },
    "targetLang": {
        type: String,
        default: null
    },
    "translatedContent": {
        type: String,
        default: null
    }
})


module.exports = mongoose.model('File', FileSchema)