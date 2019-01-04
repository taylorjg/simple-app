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
      const data = await getWeatherInfo(this.locations.map(l => l.id))
      this.setState({ weatherInfos: data.list })
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
            <WeatherInfo
              key={weatherInfo.id}
              country={weatherInfo.sys.country}
              city={weatherInfo.name}
              description={weatherInfo.weather[0].description}
              icon={weatherInfo.weather[0].icon}
              temp={weatherInfo.main.temp}
              tempMin={weatherInfo.main.temp_min}
              tempMax={weatherInfo.main.temp_max}
            />)
          : <div>Loading...</div>
      }
    </div>
  }
}
