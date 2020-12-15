import React, { useContext, useState } from 'react'
import { FileContext } from '../../context/FileContext'

export default function FormInput({ disabledByDefault, type, defaultValue }) {
    const [isDisabled, setIsDisabled] = useState(disabledByDefault)
    const [value, setValue] = useState(defaultValue)

    const [file, setFile, supportedFiles, setSupportedFiles, instruction, setInstruction] = useContext(FileContext)

    function eventHandle(e) {
        switch (e.target.id) {
            case 'file': 
                document.getElementById('file-hidden').click()
                break 

            case 'file-hidden':
                if (!supportedFiles.includes(e.target.files[0].type)) return setInstruction('File Type Unsupported')
                // FileService - upload file 
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
                <select className="my-2 form-item" disabled={isDisabled}>
                    <option selected>{value}</option>
                </select>
            )

        case 'submit':
            return (
                <div>
                    <input disabled={isDisabled} className="my-2 form-item" type="submit" value={value}></input>
                </div>
            )
    }
}
