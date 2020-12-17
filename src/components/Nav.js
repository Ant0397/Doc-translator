import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FileContext } from '../context/FileContext'
import FileService from '../services/FileService'

export default function Nav() {
    const [sticky, setSticky] = useState(null)

    const [
        fileId, setFileId, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction
    ] = useContext(FileContext)
    
    let history = useHistory()

    function handleEvent(e) {
        switch (e.target.id) {
            case 'reset':
                sessionStorage.removeItem('fileId')
                return history.push('/')

            case 'download':
                FileService.createDoc(sessionStorage.getItem('fileId'))
                    .then(res => {
                        if (res.status == 201) {
                            res.json()
                                .then(data => {
                                    window.location.href = `/api/file/download/${encodeURIComponent(data.path)}`
                                })
                        } else {
                            res.json()
                                .then(data => {
                                    setInstruction(data.message)
                                })
                        }
                    })
        }
    }

    // set onscroll event to pin nav to top of page 
    useEffect(() => {
        setInstruction('Your Document Is Ready')

        let navElement = document.getElementById('nav')
        let navContainerElement = document.getElementById('nav-container')

        setSticky(navElement.offsetTop)

        window.onscroll = () => {
            if (window.pageYOffset > sticky) {
                navContainerElement.classList.add('d-flex', 'justify-content-center')
                navElement.classList.add('sticky')
            } else {
                navContainerElement.classList.remove('d-flex', 'justify-content-center')
                navElement.classList.remove('sticky')
            }
        }
    }, [])

    return (
        <nav id="nav" className="d-flex justify-content-center">
            <button onClick={handleEvent} class="nav-item left form-item" id="reset">Reset</button>
            <button onClick={handleEvent} class="nav-item right form-item" id="download">Download</button>
        </nav>
    )
}
