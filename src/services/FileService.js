module.exports = {
    upload: (file) => {
        let formData = new FormData()
        formData.append('file', file)

        return fetch('/api/file/upload', {
            method: 'POST',
            headers: {
                'Accept': 'Application/Json'
            },
            body: formData
        }).then(res => res.json())
            .then(data => data)
    },

    getFile: (fileId) => {
        return fetch(`/api/file/${fileId}`)
            .then(res => res.json())
            .then(data => data)
    }

    // download 
    // delete in progress
}