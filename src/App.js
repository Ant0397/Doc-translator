import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import TranslationPage from './pages/TranslationPage'
import UploadPage from './pages/UploadPage'

export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path="/">
                    <UploadPage />
                </Route>
                <Route path="/translation">
                    <TranslationPage />
                </Route>
            </Switch>
        </Router>
    )
}
