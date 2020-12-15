import React, { createContext, useEffect, useState } from 'react'
import LanguageService from '../services/LanguageService'

export const LanguageContext = createContext()

export function LanguageProvider({ children }) {
    const [languages, setLanguages] = useState(null)
    const [targetLanguage, setTargetLanguage] = useState(null)
    const [isoCodes, setIsoCodes] = useState(null)

    useEffect(() => {
        LanguageService.getLanguages()
            .then(data => {
                setLanguages(data[0])
                setIsoCodes(data[1])
            })
    }, [])

    return (
        <LanguageContext.Provider value={[languages, setLanguages, targetLanguage, setTargetLanguage, isoCodes, setIsoCodes]}>
            { children }
        </LanguageContext.Provider>
    )
}
