import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Doc from '../components/Doc'
import Header from '../components/Header'
import Nav from '../components/Nav'
import { FileContext } from '../context/FileContext'
import { Container, Col, Row } from 'reactstrap'

export default function TranslationPage() {
    const [
        file, setFile, 
        supportedFiles, setSupportedFiles, 
        instruction, setInstruction
    ] = useContext(FileContext)
    
    let history = useHistory()

    // set file from session storage on component mount 
    useEffect(() => {
        if (sessionStorage.getItem('file')) {
            setFile(JSON.parse(sessionStorage.getItem('file')))
        } else {
            return history.push('/')
        }
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
                        { file && file.content ?
                            <Doc position="left" title="Original" id="original" content={file.content} />    
                        :
                            null
                        }
                    </Col>
                    <Col className="d-flex justify-content-center" md="6">
                        { file && file.translatedContent ?
                            <Doc position="right" title={`Translation ${file.targetLangName}`} id="translation" content={file.translatedContent} />
                        :
                            null 
                        }
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
