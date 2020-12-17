import React, { useContext, useEffect } from 'react'
import CustomForm from '../components/form/CustomForm'
import Header from '../components/Header'
import { FileContext } from '../context/FileContext'
import { LanguageProvider } from '../context/LanguageContext'

export default function UploadPage() {
    const [
        fileId, setFileId, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction,
    ] = useContext(FileContext)

    // reset form for new journey 
    useEffect(() => {
        setFileId(null)
        setInstruction('Upload a document to begin (.doc, .docx)')
    }, [])

    return (
        <div className="page">
            <Header />
            <LanguageProvider>
                <CustomForm />
            </LanguageProvider>
        </div>
    )
}
