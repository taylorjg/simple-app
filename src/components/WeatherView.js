import React, { Component } from 'react'
import { WeatherInfo } from './WeatherInfo'
import { getWeatherInfo } from '../services/weatherInfo'
import './WeatherView.css'

export class WeatherView extends Component {

  constructor() {
    super()
    this.locations = [
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
    this.state = {
      weatherInfos: null
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
    console.log(`[WeatherView#getWeatherInfos]`)
    try {
      const weatherInfos = await getWeatherInfo(this.locations.map(location => location.id))
      this.setState({ weatherInfos })
    } catch (error) {
      console.error(`[WeatherView#getWeatherInfos] error: ${error}`)
      // TODO: better error handling
    }
  }

  onRefresh() {
    console.log(`[WeatherView#onRefresh]`)
    this.getWeatherInfos()
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
          <span className="btn btn-xs btn-success pull-right" title="Refresh"
            onClick={() => this.onRefresh()}>
            <i className="fas fa-redo"></i>
          </span>
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
