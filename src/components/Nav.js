import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'

export default function Nav() {
    const [sticky, setSticky] = useState(null)
    
    let history = useHistory()

    function handleEvent(e) {
        switch (e.target.id) {
            case 'reset':
                sessionStorage.removeItem('fileId')
                return history.push('/')
        }
    }

    useEffect(() => {
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
    })

    return (
        <nav id="nav" className="d-flex justify-content-center">
            <button onClick={handleEvent} class="nav-item left form-item" id="reset">Reset</button>
            <button class="nav-item right form-item" id="download">Download</button>
        </nav>
    )
}
