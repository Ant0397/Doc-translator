import React from 'react'
import CustomForm from '../components/form/CustomForm'
import Header from '../components/Header'
import { FileProvider } from '../context/FileContext'

export default function UploadPage() {

    return (
        <div className="page">
            <FileProvider>
                <Header />
                <CustomForm />
            </FileProvider>
        </div>
    )
}
