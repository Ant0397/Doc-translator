import React, { useContext } from 'react'
import { FileContext } from '../../context/FileContext'
import { LanguageContext } from '../../context/LanguageContext'
import LanguageService from '../../services/LanguageService'
import FormInput from './FormInput'

export default function CustomForm() {
    const [file, setFile, supportedFiles, setSupportedFiles, instruction, setInstruction] = useContext(FileContext)
    const [allLanguages, setAllLanguages, targetLanguage, setTargetLanguage, isoCodes, setIsoCodes] = useContext(LanguageContext)

    function submitForm(e) {
        e.preventDefault()
        LanguageService.translate(file, targetLanguage)
        
    }

    return (
        <form onSubmit={submitForm} className="mt-5 d-flex flex-column justify-content-center align-items-center">
            <FormInput disabledByDefault={false} type="file" defaultValue="Select File" />
            <FormInput disabledByDefault={true} type="select" defaultValue="Languages" />
            <FormInput disabledByDefault={true} type="submit" defaultValue="Translate" />
        </form>
    )
}
