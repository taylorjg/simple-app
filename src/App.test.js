import React from 'react'
import ReactDOM from 'react-dom'
import { ThemeProvider } from '@chakra-ui/core'
import App from './App'

it('renders without crashing', () => {
  const container = document.createElement('div')
  ReactDOM.render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
    container)
  ReactDOM.unmountComponentAtNode(container)
})
