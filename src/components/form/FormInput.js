import React, { useContext, useEffect, useState } from 'react'
import { FileContext } from '../../context/FileContext'
import { LanguageContext } from '../../context/LanguageContext'
import FileService from '../../services/FileService'

export default function FormInput({ disabledByDefault, type, defaultValue }) {
    const [isDisabled, setIsDisabled] = useState(disabledByDefault)
    const [value, setValue] = useState(defaultValue)

    const [
        fileId, setFileId, 
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
                if (fileId) {
                    setIsDisabled(true)
                    setValue('File Uploaded')
                } else {
                    setIsDisabled(false)
                    setValue(defaultValue)
                }
                break 

            case 'select':
                
                fileId ? setIsDisabled(false) : setIsDisabled(true) 

                break 

            case 'submit':
                targetLanguageCode && targetLanguageName ? setIsDisabled(false) : setIsDisabled(true) 
        }
    })

    function eventHandle(e) {
        switch (e.target.id) {
            // clicks hidden file input to trigger upload
            case 'file': 
                document.getElementById('file-hidden').click()
                break 

            // extracts file content and uploads to DB
            case 'file-hidden':
                if (!supportedFiles.includes(e.target.files[0].type)) return setInstruction('File Type Unsupported')
                FileService.upload(e.target.files[0])
                    .then(data => {
                        if (data.id) {
                            setFileId(data.id)
                        }
                        setInstruction(data.message)
                    })
                break

            case 'select':
                setInstruction(`Your Document Will Be Translated Into ${e.target.selectedOptions[0].innerText}`)
                setTargetLanguageCode(e.target.value)
                setTargetLanguageName(e.target.selectedOptions[0].innerText)
                break 

            case 'reset':
                setFileId(null)
                setTargetLanguageName(null)
                setTargetLanguageCode(null)
                setInstruction('Upload a document to begin (.doc, .docx)')
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
                        <option id="default" value="default" selected>{value}</option>

                        { allLanguages && isoCodes ? 
                            allLanguages.map((language) => (
                                <option key={isoCodes[allLanguages.indexOf(language)]} value={isoCodes[allLanguages.indexOf(language)]}>{`${language.name} (${language.nativeName})`}</option>
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

        case 'reset': 
            return (
                <div>
                    <input id="reset" onClick={eventHandle} disabled={isDisabled} className="my-2 form-item form-btn" type="button" value={value} />
                </div>
            ) 
    }
}
