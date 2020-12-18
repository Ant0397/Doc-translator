import React, { createContext, useState } from 'react'

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
