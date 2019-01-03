import React, { Component } from 'react'
import { WeatherInfo } from './WeatherInfo'
import { getWeatherInfo } from '../services/weatherInfo'
import './WeatherView.css'

export class WeatherView extends Component {

  constructor() {
    super()
    this.location = {
      country: 'UK',
      city: 'Manchester'
    }
    this.state = {
      weatherInfo: null
    }
  }

  async componentDidMount() {
    try {
      const weatherInfo = await getWeatherInfo(this.location.country, this.location.city)
      this.setState({ weatherInfo })
    } catch (error) {
      console.error(`[WeatherView#componentDidMount] error: ${error}`)
      // TODO: error handling
    }
  }

  componentDidCatch(error, info) {
    console.error(`[WeatherView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  render() {
    return <div className="weatherView">
      {
        this.state.weatherInfo
          ? <WeatherInfo
            country={this.state.weatherInfo.sys.country}
            city={this.state.weatherInfo.name}
            description={this.state.weatherInfo.weather[0].description}
            temp={this.state.weatherInfo.main.temp}
            tempMin={this.state.weatherInfo.main.temp_min}
            tempMax={this.state.weatherInfo.main.temp_max}
          />
          : <div>Loading...</div>
      }
    </div>
  }
}
