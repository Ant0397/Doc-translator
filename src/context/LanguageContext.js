import React, { createContext, useEffect, useState } from 'react'
import LanguageService from '../services/LanguageService'

export const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [allLanguages, setAllLanguages] = useState(null)
    const [targetLanguageCode, setTargetLanguageCode] = useState(null)
    const [targetLanguageName, setTargetLanguageName] = useState(null)
    const [isoCodes, setIsoCodes] = useState(null)

    useEffect(() => {
        LanguageService.getLanguages()
            .then(data => {
                setAllLanguages(data[0])
                setIsoCodes(data[1])
            })
    }, [])

    return (
        <LanguageContext.Provider value={[allLanguages, setAllLanguages, targetLanguageCode, setTargetLanguageCode, targetLanguageName, setTargetLanguageName, isoCodes, setIsoCodes]}>
            { children }
        </LanguageContext.Provider>
    )
}
