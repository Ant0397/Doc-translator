import React, { useContext, useEffect } from 'react'
import CustomForm from '../components/form/CustomForm'
import Header from '../components/Header'
import RecentFiles from '../components/file-icons/RecentFiles'
import { FileContext } from '../context/FileContext'
import { LanguageProvider } from '../context/LanguageContext'
import FileService from '../services/FileService'

export default function UploadPage() {
    const [
        fileId, setFileId, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction,
        translatedContent, setTranslatedContent,
        recentFiles, setRecentFiles
    ] = useContext(FileContext)

    // reset form for new journey 
    useEffect(() => {
        setFileId(null)
        setInstruction('Upload a document to begin (.doc, .docx)')
        FileService.getRecentFiles()
            .then(data => {
                data.files ? setRecentFiles(data.files) : setRecentFiles(data.message)
            })
    }, [])

    return (
        <div className="page">
            <Header />

            <LanguageProvider>
                <CustomForm />
            </LanguageProvider>

            { recentFiles ? <RecentFiles files={recentFiles} /> : null }
        </div>
    )
}
