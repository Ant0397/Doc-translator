const titleElement = document.querySelector('.title')
const fileSelectHidden = document.getElementById('file-select-hidden')
const uploadFileBtn = document.getElementById('upload-file')
const langSelect = document.getElementById('language-select')
const translateBtn = document.getElementById('translate')
const recentDocs = document.querySelectorAll('.wrapper')
const deleteBtns = document.querySelectorAll('.fa-times-circle')
const supportedFiles = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'] // mimetypes

populateDropdown()  

uploadFileBtn.addEventListener('click', () => {
    fileSelectHidden.click()
})

fileSelectHidden.addEventListener('change', (e) => {
    handleEvent(e)
})

langSelect.addEventListener('change', (e) => {
    handleEvent(e)
})

translateBtn.addEventListener('click', (e) => {
    handleEvent(e)
})

recentDocs.forEach(doc => {
    doc.addEventListener('click', () => {
        sessionStorage.setItem('fileId', doc.parentElement.id)
        window.location.href = '/translation/' + doc.parentElement.id
    })
})

deleteBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        window.location.href = '/file/delete/' + btn.parentElement.id
        window.location.reload()
    })
})


async function uploadFile(file)
{
    let formData = new FormData()
    formData.append('file', file)

    let response = await fetch('/file/upload', {
        method: 'POST',
        body: formData
    })

    let fileId = await response.json()

    return {
        'fileId': fileId,
        'status': response.status
    }
}


function disableElement(element)
{
    element.setAttribute('disabled', 'true')
}


function enableElement(element)
{
    element.removeAttribute('disabled')
}


async function handleEvent(event) // switch statement to handle user input depending on application state
{
    let selectedOption = document.querySelector('option:checked')
    switch (event.target) {

        // upload file
        case fileSelectHidden:
            if (! supportedFiles.includes(event.target.files[0].type)) {
                titleElement.innerText = 'File type unsupported'
                return
            } else {
                let upload = await uploadFile(event.target.files[0])
                if (upload.status == 500) { // if file was not uploaded
                    titleElement.innerText = 'Error uploading. Please try again'
                    return
                } else if (upload.status == 415) {
                    titleElement.innerText = 'Please ensure your file does not contain images'
                    return
                } else { // proceed
                    disableElement(uploadFileBtn)
                    enableElement(langSelect)
                    enableElement(translateBtn)
                    uploadFileBtn.innerText = 'File Uploaded'
                    titleElement.innerText = 'Select the language you want to translate to'
                    sessionStorage.setItem('fileId', upload.fileId)
                    return
                }
            }

        // select language
        case langSelect: 
            if (selectedOption.value == 'default') { // if no option selected
                titleElement.innerText = 'Select the language you want to translate to'
            } else {
                titleElement.innerText = 'Your document will be translated into ' + selectedOption.innerText
            }
            return

        // translate
        case translateBtn:
            if (selectedOption.value == 'default') { // if no option selected
                titleElement.innerText = 'Please select a language before continuing'
            } else {
                await translate(langSelect.value, langSelect.selectedOptions[0].innerText.split(' ')[0])
                window.location.href = '/translation/' + sessionStorage.getItem('fileId')
            }
            return
    }
}


async function getLanguages()
{
    let languageObj
    if (! sessionStorage.getItem('languages')) { // retrieve languages through API

            let languages = await fetch('/languages/get-languages', { // API call returns object containing supported languages -- {ISO code: {languageObject}}
                'content-type': 'application/json',
                'accept': 'application/json'
            }).then(res => res.json())

            let isoCodes = Object.getOwnPropertyNames(languages)

            languageObj = {
                'languages': languages,
                'codes': isoCodes
            }

            sessionStorage.setItem('languages', JSON.stringify(languageObj))
    } else { // else retrieve languages from session

        languageObj = JSON.parse(sessionStorage.getItem('languages'))
    }

    return languageObj
}


async function populateDropdown()
{
    let languageObj = await getLanguages()

    let languages = languageObj.languages 
    let languageCodes = languageObj.codes

    // populate list
    for (x = 0; x < languageCodes.length; x++) {
        let optionElement = document.createElement('option')
        optionElement.value = languageCodes[x]
        optionElement.innerText = `${languages[languageCodes[x]].nativeName} (${languages[languageCodes[x]].name})`
        langSelect.appendChild(optionElement)
    }
}


async function translate(languageCode, nativeName)
{
    await fetch('/languages/translate', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        }, body: JSON.stringify({
            language: languageCode,
            nativeName: nativeName,
            fileId: sessionStorage.getItem('fileId')
        })
    })
}