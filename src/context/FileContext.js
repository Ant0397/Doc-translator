import React, { createContext, useState } from 'react'

export const FileContext = createContext()

export function FileProvider({ children }) {
    const [file, setFile] = useState(null)
    const [supportedFiles, setSupportedFiles] = useState([
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ])
    const [instruction, setInstruction] = useState('Upload a document to begin (.doc, .docx)')
    
    return (
        <FileContext.Provider value={[file, setFile, supportedFiles, setSupportedFiles, instruction, setInstruction]}>
            { children }
        </FileContext.Provider>
    )
}
