import React, { Component } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { WeatherView } from './components/weatherView/WeatherView'
import { PreferencesView } from './components/preferencesView/PreferencesView'
import { version } from '../package.json'
import './App.css'

const LOCATIONS = [
  {
    country: 'GB',
    city: 'Manchester',
    id: 2643123
  },
  {
    country: 'GB',
    city: 'Edinburgh',
    id: 2650225
  },
  {
    country: 'GB',
    city: 'London',
    id: 2643743
  },
  {
    country: 'AU',
    city: 'Sydney',
    id: 2147714
  }
]

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      locations: LOCATIONS
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
            <Route path="/" exact
              render={props =>
                <WeatherView {...props} locations={this.state.locations} />
              }
            />
            <Route path="/preferences" exact
              render={props =>
                <PreferencesView {...props} locations={this.state.locations} saveLocations={this.saveLocations.bind(this)} />
              }
            />
          </div>
        </Router>
      </div>
    )
  }
}

export default App
