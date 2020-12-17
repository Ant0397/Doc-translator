import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Doc from '../components/Doc'
import Header from '../components/Header'
import Nav from '../components/Nav'
import { FileContext } from '../context/FileContext'
import FileService from '../services/FileService'
import { Container, Col, Row } from 'reactstrap'

export default function TranslationPage() {
    const [
        fileId, setFileId, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction
    ] = useContext(FileContext)
    
    const [content, setContent] = useState(null)
    const [translatedContent, setTranslatedContent] = useState(null)
    const [language, setLanguage] = useState(null)

    let history = useHistory()

    // use id saved in state to return file contents from DB
    useEffect(() => {
        if (!sessionStorage.getItem('fileId')) return history.push('/')

        FileService.getFile(sessionStorage.getItem('fileId'))
            .then(res => {
                if (res.status == 200) {
                    res.json()
                        .then(data => {
                            setContent(data.content)
                            setTranslatedContent(data.translatedContent)
                            setLanguage(data.targetLangName)
                        })
                } else {
                    res.json()
                        .then(data => setInstruction(data.message))
                }
            })
    }, [])

    return (
        <div className="page">
            <Header />
            <Container id="nav-container" fluid>
                <Nav />
            </Container>
            <Container fluid>
                <Row>
                    <Col className="d-flex justify-content-center" md="6">
                        { content ?
                            <Doc position="left" title="Original" id="original" content={content} />    
                        :
                            null
                        }
                    </Col>
                    <Col className="d-flex justify-content-center" md="6">
                        { translatedContent ?
                            <Doc position="right" title={`Translation ${language}`} id="translation" content={translatedContent} />
                        :
                            null 
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
