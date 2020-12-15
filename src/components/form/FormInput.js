import React, { useContext, useEffect, useState } from 'react'
import { FileContext } from '../../context/FileContext'
import FileService from '../../services/FileService'

export default function FormInput({ disabledByDefault, type, defaultValue }) {
    const [isDisabled, setIsDisabled] = useState(disabledByDefault)
    const [value, setValue] = useState(defaultValue)

    const [file, setFile, supportedFiles, setSupportedFiles, instruction, setInstruction] = useContext(FileContext)

    useEffect(() => {
        switch (type) {
            case 'select':
                file ? setIsDisabled(false) : null 
        }
    })

    function eventHandle(e) {
        switch (e.target.id) {
            case 'file': 
                document.getElementById('file-hidden').click()
                break 

            case 'file-hidden':
                if (!supportedFiles.includes(e.target.files[0].type)) return setInstruction('File Type Unsupported')

                FileService.upload(e.target.files[0])
                    .then(data => {
                        data.id ? setFile(data.id) : null 
                        setInstruction(data.message)
                        setValue('File Uploaded')
                        setIsDisabled(true)
                    })
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
                    <select className="my-2 form-item" disabled={isDisabled}>
                        <option selected>{value}</option>
                    
                    </select>
                </div>
            )

        case 'submit':
            return (
                <div>
                    <input disabled={isDisabled} className="my-2 form-item" type="submit" value={value}></input>
                </div>
            )
    }
}
