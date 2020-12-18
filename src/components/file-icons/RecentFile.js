import React, { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileWord, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { useHistory } from 'react-router-dom'
import FileService from '../../services/FileService'
import { FileContext } from '../../context/FileContext'

export default function RecentFile({ file }) {
    const [
        fileId, setFileId, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction,
        translatedContent, setTranslatedContent,
        recentFiles, setRecentFiles
    ] = useContext(FileContext)
    
    let history = useHistory()

    // removes from DB, not from state
    function deleteFile() {
        FileService.deleteFile(file._id)
            .then(res => {
                if (res.status !== 204) {
                    res.json()
                        .then(data => setInstruction(data.message))
                } else {
                    setRecentFiles(recentFiles.filter(recentFile => recentFile._id !== file._id))
                }
            })
    }

    function openFile() {
        sessionStorage.setItem('fileId', file._id)
        return history.push('/translation')
    }

    return (
        <div className="m-3">
            <FontAwesomeIcon onClick={deleteFile} className="ml-3 mb-1" icon={faTimesCircle} size="2x" />
            <div className="d-flex flex-column align-items-center wrapper py-3 px-5">
                <FontAwesomeIcon onClick={openFile} icon={faFileWord} size="6x" />
                <p className="mt-1 text-center">{`${file.filename}.${file.ext} ${file.targetLangName}`}</p>
            </div>
        </div>
    )
}

{/* <div id="<%= file.id %>" class="file-container">
                            <i class="fas fa-times-circle fa-2x"></i>
                            <div class="wrapper">
                                <i class="fas fa-file-word fa-7x"></i>
                                <p> <%=`${file.filename}.${file.ext} (${file.targetLang})` %></p>
                            </div>
                        </div>   */}