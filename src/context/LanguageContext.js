import React, { createContext, useEffect, useState } from 'react'
import LanguageService from '../services/LanguageService'

export const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [allLanguages, setAllLanguages] = useState(null)
    const [targetLanguageCode, setTargetLanguageCode] = useState(null)
    const [targetLanguageName, setTargetLanguageName] = useState(null)
    const [isoCodes, setIsoCodes] = useState(null)

    // retrive supported languages from session storage or API call 
    useEffect(() => {
        if (sessionStorage.getItem('allLanguages') && sessionStorage.getItem('isoCodes')) {
            setAllLanguages(JSON.parse(sessionStorage.getItem('allLanguages')))
            setIsoCodes(JSON.parse(sessionStorage.getItem('isoCodes')))
        } else {
            LanguageService.getLanguages()
                .then(data => {
                    setAllLanguages(data[0])
                    setIsoCodes(data[1])
                    sessionStorage.setItem('allLanguages', JSON.stringify(data[0]))
                    sessionStorage.setItem('isoCodes', JSON.stringify(data[1]))
                })
        }
    }, [])

    return (
        <LanguageContext.Provider value={[allLanguages, setAllLanguages, targetLanguageCode, setTargetLanguageCode, targetLanguageName, setTargetLanguageName, isoCodes, setIsoCodes]}>
            { children }
        </LanguageContext.Provider>
    )
}
