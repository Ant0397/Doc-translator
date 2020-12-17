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

    useEffect(() => {
        if (!sessionStorage.getItem('fileId')) return history.push('/')
        setInstruction('Your Document Is Ready')
        FileService.getFile(sessionStorage.getItem('fileId'))
            .then(data => {
                setContent(data.original)
                setTranslatedContent(data.translated)
                setLanguage(data.language)
            })
        
    }, [])

    return (
        <div className="page">
            <Header />
            {/* add justify center on overlay, not sticky */}
            <Container id="nav-container" fluid>
                {/* Make transparent on overlay */}
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
