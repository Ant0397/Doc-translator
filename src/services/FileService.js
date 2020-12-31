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
            .then(res => res)
    },

    getRecentFiles: () => {
        return fetch('/api/file/recent-files')
            .then(res => res.json())
            .then(data => data)
    },

    createDoc: (file) => {
        return fetch('/api/file/create-doc', {
            method: 'POST',
            headers: {
                'Content-Type': 'Application/Json'
            },
            body: JSON.stringify({ file })
        }).then(res => res)
    },

    deleteFile: (fileId) => {
        return fetch(`/api/file/${fileId}`, {
            method: 'DELETE'
        }).then(res => res)
    }   

    // delete in progress
}