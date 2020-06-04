import React, { useState } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { WeatherViewWithHeader } from './components/weatherView/WeatherView'
import { PreferencesViewWithHeader } from './components/preferencesView/PreferencesView'
import { DEFAULT_LOCATIONS } from './defaultLocations'
import { version } from '../package.json'
import log from 'loglevel'
import './App.css'

// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
const RouteWithProps = ({ component, ...rest }) =>
  <Route {...rest} render={props =>
    React.createElement(component, { ...props, ...rest })} />

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
        <div>
          <RouteWithProps path={['/', '/index.html']} exact component={WeatherViewWithHeader}
            locations={locations}
            onRemoveLocation={onRemoveLocation}
          />
          <RouteWithProps path="/preferences" exact component={PreferencesViewWithHeader}
            locations={locations}
            onAddLocation={onAddLocation}
            onRemoveLocation={onRemoveLocation}
          />
          {/* TODO: default not found page ? */}
        </div>
      </Router>
    </div>
  )
}

export default App
