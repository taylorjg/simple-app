import React, { Component } from 'react'
import { ErrorPanel } from './ErrorPanel'
import { WeatherInfo } from './WeatherInfo'
import { getWeatherInfo } from '../services/weatherInfo'
import './WeatherView.css'

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

const LOCATION_IDS = LOCATIONS.map(location => location.id)

export class WeatherView extends Component {

  constructor() {
    super()
    this.state = {
      weatherInfos: null,
      busy: false,
      errorMessage: null
    }
  }

  componentDidMount() {
    console.log(`[WeatherView#componentDidMount]`)
    this.getWeatherInfos()
  }

  componentDidCatch(error, info) {
    console.error(`[WeatherView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  async getWeatherInfos() {
    try {
      console.log(`[WeatherView#getWeatherInfos]`)
      this.setState({ busy: true })
      const weatherInfos = await getWeatherInfo(LOCATION_IDS)
      this.setState({ weatherInfos })
    } catch (error) {
      console.error(`[WeatherView#getWeatherInfos] ${error.message}`)
      this.setState({
        weatherInfos: null,
        errorMessage: error.message
      })
    } finally {
      setTimeout(() => {
        this.setState({ busy: false })
      }, 250)
    }
  }

  onRefresh() {
    console.log(`[WeatherView#onRefresh]`)
    this.getWeatherInfos()
  }

  clearErrorMessage() {
    this.setState({ errorMessage: null })
  }

  renderWeatherInfos() {
    console.log(`[WeatherView#renderWeatherInfos]`)
    return this.state.weatherInfos.map(weatherInfo =>
      <WeatherInfo key={weatherInfo.id} {...weatherInfo} />)
  }

  render() {
    return <div>
      <div className="row">
        <div className="row-margins">
          <div className="pull-right">
            {
              this.state.busy &&
              <img className="busy-indicator" alt="busy indicator" src="/spinner.gif" />
            }
            <span className="btn btn-xs btn-success" title="Refresh"
              onClick={() => this.onRefresh()}>
              <i className="fas fa-redo"></i>
            </span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="row-margins">
          <ErrorPanel errorMessage={this.state.errorMessage}
            onClose={() => this.clearErrorMessage()} />
        </div>
      </div>
      <div className="row">
        <div className="weatherView">
          {this.state.weatherInfos && this.renderWeatherInfos()}
        </div>
      </div>
    </div>
  }
}
