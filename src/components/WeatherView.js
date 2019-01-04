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

  async componentDidMount() {
    try {
      const weatherInfos = await getWeatherInfo(this.locations.map(location => location.id))
      this.setState({ weatherInfos })
    } catch (error) {
      console.error(`[WeatherView#componentDidMount] error: ${error}`)
      // TODO: better error handling
    }
  }

  componentDidCatch(error, info) {
    console.error(`[WeatherView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  render() {
    return <div className="weatherView">
      {
        this.state.weatherInfos
          ? this.state.weatherInfos.map(weatherInfo =>
            <WeatherInfo key={weatherInfo.id} {...weatherInfo} />)
          : <div>Loading...</div>
      }
    </div>
  }
}
