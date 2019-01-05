import React, { Component } from 'react'
import { WeatherView } from './components/WeatherView'
import { version } from '../package.json'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="row-margins">
            <span className="version pull-right">version: {version}</span>
          </div>
          <div className="row-margins">
            <hr />
          </div>
        </div>
        <WeatherView />
      </div>
    )
  }
}

export default App
