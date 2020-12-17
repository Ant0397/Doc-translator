import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { FileProvider } from './context/FileContext'
import TranslationPage from './pages/TranslationPage'
import UploadPage from './pages/UploadPage'

export default function App() {
    return (
        <Router>
            <Switch>
                <FileProvider>
                    <Route exact path="/">
                        <UploadPage />
                    </Route>
                    <Route path="/translation">
                        <TranslationPage />
                    </Route>
                </FileProvider>
            </Switch>
        </Router>
    )
}
