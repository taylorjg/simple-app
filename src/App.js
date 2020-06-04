import React, { useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Header } from './components/common/Header'
import { WeatherView } from './components/weatherView/WeatherView'
import { PreferencesView } from './components/preferencesView/PreferencesView'
import { DEFAULT_LOCATIONS } from './defaultLocations'
import { version } from '../package.json'
import log from 'loglevel'
import './App.css'

const App = () => {
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS)

  const onAddLocation = location => {
    log.info(`[App#onAddLocation] location: ${JSON.stringify(location)}`)
    setLocations([...locations, location])
  }

  const onRemoveLocation = id => {
    log.info(`[App#onRemoveLocation] id: ${id}`)
    setLocations(locations.filter(location => location.id !== id))
  }

  const onShowErrorMessage = errorMessage => {
    // this.setState({ errorMessage })
  }

  const onClearErrorMessage = () => {
    // this.setState({ errorMessage: '' })
  }

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
      <Router>
        <Route path={['/', '/index.html']} exact>
          <Header />
          <WeatherView
            locations={locations}
            onRemoveLocation={onRemoveLocation}
            onShowErrorMessage={onShowErrorMessage}
            onClearErrorMessage={onClearErrorMessage}
          />
        </Route>
        <Route path="/preferences" exact>
          <Header />
          <PreferencesView
            locations={locations}
            onAddLocation={onAddLocation}
            onRemoveLocation={onRemoveLocation}
            onShowErrorMessage={onShowErrorMessage}
            onClearErrorMessage={onClearErrorMessage}
          />
        </Route>
      </Router>
    </div>
  )
}

export default App
