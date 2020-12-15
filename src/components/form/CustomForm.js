import React from 'react'
import FormInput from './FormInput'

export default function CustomForm() {
    return (
        <form className="mt-5 d-flex flex-column justify-content-center align-items-center">
            <FormInput disabledByDefault={false} type="file" defaultValue="Select File" />
            <FormInput disabledByDefault={true} type="select" defaultValue="Languages" />
            <FormInput disabledByDefault={true} type="submit" defaultValue="Translate" />
        </form>
    )
}
