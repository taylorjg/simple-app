import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider, ColorModeProvider } from '@chakra-ui/core'
import App from './App'
import * as serviceWorker from './serviceWorker'
import log from 'loglevel'
import './index.css'

const ThemedApp = () => (
    <ThemeProvider>
        <ColorModeProvider>
            <App />
        </ColorModeProvider>
    </ThemeProvider>
)

ReactDOM.render(<ThemedApp />, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()

// So that we can change the current log level in a browser's developer tools window
// e.g. log.setLevel('debug')
window.log = log
