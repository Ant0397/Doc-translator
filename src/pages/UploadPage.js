import React from 'react'
import CustomForm from '../components/form/CustomForm'
import Header from '../components/Header'
import { FileProvider } from '../context/FileContext'
import { LanguageProvider } from '../context/LanguageContext'

export default function UploadPage() {

    return (
        <div className="page">
            <FileProvider>
                <Header />
                <LanguageProvider>
                    <CustomForm />
                </LanguageProvider>
            </FileProvider>
        </div>
    )
}
