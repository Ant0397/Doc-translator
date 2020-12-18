import React, { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { FileContext } from '../../context/FileContext'
import { LanguageContext } from '../../context/LanguageContext'
import LanguageService from '../../services/LanguageService'
import FormInput from './FormInput'

export default function CustomForm() {
    const [
        fileId, setFileId, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction,
    ] = useContext(FileContext)
    const [
        allLanguages, setAllLanguages, 
        targetLanguageCode, setTargetLanguageCode, 
        targetLanguageName, setTargetLanguageName, 
        isoCodes, setIsoCodes
    ] = useContext(LanguageContext)

    let history = useHistory()

    function disableForm(children) {
        for (let child of children) {
            if (child.childNodes[0].disabled) continue
            child.childNodes[0].disabled = true  
        }
    }

    function submitForm(e) {
        e.preventDefault()
        disableForm(e.target.children)
        setInstruction('Please Wait...')
        LanguageService.translate(fileId, targetLanguageCode, targetLanguageName)
            .then(res => {
                if (res.status == 200) {
                    // setting session storage allows state to persist on page reloads
                    sessionStorage.setItem('fileId', fileId)
                    return history.push('/translation')
                } else {
                    res.json()
                        .then(data => setInstruction(data.message))
                }
            })
    }

    return (
        <form onSubmit={submitForm} className="my-5 d-flex flex-column justify-content-center align-items-center">
            <FormInput disabledByDefault={false} type="file" defaultValue="Select File" />
            <FormInput disabledByDefault={true} type="select" defaultValue="Languages" />
            <FormInput disabledByDefault={true} type="submit" defaultValue="Translate" />
        </form>
    )
}
