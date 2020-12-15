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

    translate: (fileId, targetLang) => {
        return fetch('/api/languages/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/Json'
            },
            body: JSON.stringify({ fileId, targetLang })
        })
    }
}