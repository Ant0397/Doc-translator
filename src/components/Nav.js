import React from 'react'
import { useHistory } from 'react-router-dom'

export default function Nav() {
    let history = useHistory()

    function handleEvent(e) {
        switch (e.target.id) {
            case 'reset':
                sessionStorage.removeItem('fileId')
                return history.push('/')
        }
    }

    return (
        <div className="nav">
            <button onClick={handleEvent} class="nav-item left form-item" id="reset">Reset</button>
            <button class="nav-item right form-item" id="download">Download</button>
        </div>
    )
}
