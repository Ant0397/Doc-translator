import React from 'react'
import { Container } from 'reactstrap'
import RecentFile from './RecentFile'
import { Row } from 'reactstrap'
export default function RecentFiles({ files }) {
    return (
        <Container fluid className="mt-5">
            <Row className="files-header d-flex justify-content-center">
                <h6 className="display-4">Recent Files</h6>
            </Row>
            <Row className="d-flex justify-content-center">
                    { files.map((file) => (
                        <RecentFile key={file._id} file={file} />
                    ))}
            </Row>
        </Container>
    )
}