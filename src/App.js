import React, { Component } from 'react'
import { WeatherView } from './components/WeatherView'
import { version } from '../package.json'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <span className="version pull-right">(version: {version})</span>
          <hr />
        </div>
        <div className="row">
          <main>
            <WeatherView />
          </main>
        </div>
      </div>
    )
  }
}

export default App
