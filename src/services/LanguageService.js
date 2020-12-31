module.exports = {
    getLanguages: () => {
        return fetch('/api/languages')
            .then(res => res.json())
            .then(data => {
                let languages = Object.values(data)
                let isoCodes = Object.keys(data)
                return [    
                    languages,
                    isoCodes
                ]
            })
    },

    translate: (file, targetLangCode, targetLangName) => {
        return fetch('/api/languages/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/Json'
            },
            body: JSON.stringify({ file, targetLangCode, targetLangName })
        }).then(res => res)
    }
}