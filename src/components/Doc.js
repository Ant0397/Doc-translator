import React, { useEffect } from 'react'

export default function Doc({ position, title, id, content }) {
    useEffect(() => {
        document.getElementById(id).innerHTML = content
    })

    return (
        <div class={position + " mt-5"}>
            <h2>{title}</h2>
            <div id={id} class="document">

            </div>
        </div>
    )
}
