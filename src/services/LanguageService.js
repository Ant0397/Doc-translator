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
    }

    // translate
}