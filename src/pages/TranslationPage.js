import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Doc from '../components/Doc'
import Header from '../components/Header'
import Nav from '../components/Nav'
import { FileContext } from '../context/FileContext'
import { LanguageContext } from '../context/LanguageContext'
import FileService from '../services/FileService'

export default function TranslationPage() {
    const [
        fileId, setFileId, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction
    ] = useContext(FileContext)
    
    const [content, setContent] = useState(null)
    const [translatedContent, setTranslatedContent] = useState(null)
    const [language, setLanguage] = useState(null)

    let history = useHistory()

    useEffect(() => {
        if (!sessionStorage.getItem('fileId')) return history.push('/')
        setInstruction('Your Document Is Ready')
        FileService.getFile(sessionStorage.getItem('fileId'))
            .then(data => {
                setContent(data.original)
                setTranslatedContent(data.translated)
                setLanguage(data.language)
            })
        
    }, [])



    return (
        <div className="page">
            <Header />
            <Nav />
            <div class="document-container">
                { content ?
                    <Doc position="left" title="Original" id="original" content={content} />    
                :
                    null
                }

                { translatedContent ?
                    <Doc position="right" title={`Translation ${language}`} id="translation" content={translatedContent} />
                :
                    null 
                }
            </div>
        </div>
    )
}
