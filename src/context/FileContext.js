import React, { createContext, useEffect, useState } from 'react'
import FileService from '../services/FileService'

export const FileContext = createContext()

export function FileProvider({ children }) {

    const [fileId, setFileId] = useState(null)
    const [supportedFiles, setSupportedFiles] = useState([
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ])
    const [instruction, setInstruction] = useState(null)
    const [translatedContent, setTranslatedContent] = useState(null)
    const [recentFiles, setRecentFiles] = useState(null)

    useEffect(() => {
        FileService.getRecentFiles()
            .then(data => {
                data.files ? setRecentFiles(data.files) : setRecentFiles(data.message)
            })
    }, [])

    return (
        <FileContext.Provider 
            value={[
                fileId, setFileId, 
                supportedFiles, setSupportedFiles, 
                instruction, setInstruction, 
                translatedContent, setTranslatedContent,
                recentFiles, setRecentFiles
            ]}>
            { children }
        </FileContext.Provider>
    )
}
