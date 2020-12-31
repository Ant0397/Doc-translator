import React, { useContext, useEffect, useState } from 'react'
import { FileContext } from '../../context/FileContext'
import { LanguageContext } from '../../context/LanguageContext'
import FileService from '../../services/FileService'

export default function FormInput({ disabledByDefault, type, defaultValue }) {
    const [isDisabled, setIsDisabled] = useState(disabledByDefault)
    const [value, setValue] = useState(defaultValue)

    const [
        file, setFile, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction
    ] = useContext(FileContext)
    const [
        allLanguages, setAllLanguages, 
        targetLanguageCode, setTargetLanguageCode, 
        targetLanguageName, setTargetLanguageName, 
        isoCodes, setIsoCodes
    ] = useContext(LanguageContext)

    // sets input state according to journey progress 
    useEffect(() => {
        switch (type) {
            case 'file':
                if (file) {
                    setIsDisabled(true)
                    setValue('File Uploaded')
                } else {
                    setIsDisabled(false)
                    setValue(defaultValue)
                }
                break 

            case 'select':
                file ? setIsDisabled(false) : setIsDisabled(true) 
                break 

            case 'submit':
                targetLanguageCode && targetLanguageName ? setIsDisabled(false) : setIsDisabled(true) 
        }
    })

    function eventHandle(e) {
        let { id, files, value, selectedOptions } = e.target

        switch (id) {
            // clicks hidden file input to trigger upload
            case 'file': 
                document.getElementById('file-hidden').click()
                break 

            // extracts file content and uploads to DB
            case 'file-hidden':
                if (!supportedFiles.includes(files[0].type)) return setInstruction('File Type Unsupported')
                FileService.upload(files[0])
                    .then(data => {
                        if (data.file) {
                            setFile(data.file)
                        }
                        setInstruction(data.message)
                    })
                break

            case 'select':
                setInstruction(`Your Document Will Be Translated Into ${selectedOptions[0].innerText}`)
                setTargetLanguageCode(value)
                setTargetLanguageName(selectedOptions[0].innerText)
                break 

            case 'resetForm':
                setFile(null)
                setTargetLanguageName(null)
                setTargetLanguageCode(null)
                setInstruction('Upload a document to begin (.doc, .docx)')
                document.querySelector('form').reset()
        }
    }

    switch (type) {
        case 'file': 
        return (
            <div>
                <input id="file-hidden" onChange={eventHandle} hidden type={type} />
                <input id="file" onClick={eventHandle} disabled={isDisabled} className="my-2 form-item" type="button" value={value} />
            </div>
        )

        case 'select':
            return (
                <div>
                    <select onChange={eventHandle} id="select" className="my-2 form-item" disabled={isDisabled}>
                        <option value="default" selected>{value}</option>

                        { allLanguages && isoCodes ? 
                            allLanguages.map((language) => (
                                <option key={allLanguages.indexOf(language)} value={isoCodes[allLanguages.indexOf(language)]}>{`${language.name} (${language.nativeName})`}</option>
                            ))    
                        : 
                            null
                        }
                    </select>
                </div>
            )

        case 'submit':
            return (
                <div>
                    <input disabled={isDisabled} className="my-2 form-item form-btn" type={type} value={value} />
                </div>
            )

        case 'resetForm': 
            return (
                <div>
                    <input id="resetForm" onClick={eventHandle} disabled={isDisabled} className="my-2 form-item form-btn" type="button" value={value} />
                </div>
            ) 
    }
}
