import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { WeatherView } from './components/weatherView/WeatherView'
import { PreferencesView } from './components/preferencesView/PreferencesView'
import { DEFAULT_LOCATIONS } from './defaultLocations'
import { version } from '../package.json'
import './App.css'

// https://github.com/ReactTraining/react-router/issues/4105#issuecomment-289195202
const RouteWithProps = ({ component, ...rest }) =>
  <Route {...rest} render={props =>
    React.createElement(component, { ...props, ...rest })} />

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      locations: DEFAULT_LOCATIONS
    }
  }

  saveLocations(locations) {
    console.log(`[App#saveLocations]`)
    this.setState({
      locations
    })
  }

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
        <Router>
          <div>
            <RouteWithProps path={['/', '/index.html']} exact component={WeatherView}
              locations={this.state.locations}
            />
            <RouteWithProps path="/preferences" exact component={PreferencesView}
              locations={this.state.locations}
              saveLocations={this.saveLocations.bind(this)}
            />
          </div>
        </Router>
      </div>
    )
  }
}

export default App
