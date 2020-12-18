import React, { useEffect } from 'react'

export default function Doc({ title, id, content }) {
    useEffect(() => {
        let documentElement = document.getElementById(id)
        documentElement.innerHTML = content
    }, [])

    return (    
        <div class="mt-5">
            <h2>{title}</h2>
            <div id={id} class="document p-5 mt-4">

            </div>
        </div>
    )
}
