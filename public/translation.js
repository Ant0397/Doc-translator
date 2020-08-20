const navElement = document.getElementById('nav')
const backBtn = document.getElementById('back')
const downloadBtn = document.getElementById('download')
const originalDocument = document.getElementById('original')
const translatedDocument = document.getElementById('translation')
const sticky = navElement.offsetTop

appendTranslationData()

// sticky nav
window.onscroll = () => {
    if (window.pageYOffset > sticky) {
        navElement.classList.add('sticky')
    } else {
        navElement.classList.remove('sticky')
    }
}

backBtn.addEventListener('click', () => {
    window.location.href = '/'
    sessionStorage.setItem('fileId', '')
})

downloadBtn.addEventListener('click', () => {
    window.location.href = '/file/download/' + sessionStorage.getItem('fileId')
})


async function appendTranslationData()
{
    let file = await fetch(`/file/content/${sessionStorage.getItem('fileId')}`).then(res => res.json())

    originalDocument.innerHTML = file.content 
    translatedDocument.innerHTML = file.translatedContent
}
