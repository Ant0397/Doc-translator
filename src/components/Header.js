import React, { useContext } from 'react'
import { FileContext } from '../context/FileContext'

export default function Header() {
    const [file, setFile, supportedFiles, setSupportedFiles, instruction, setInstruction] = useContext(FileContext)

    return (
        <div className="d-flex justify-content-center align-items-center header">
            <h1 className="title">{instruction}</h1>
        </div>
    )
}
