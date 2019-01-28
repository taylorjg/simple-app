import React from 'react'
import PropTypes from 'prop-types'
import sentenceCase from 'sentence-case'
import './WeatherInfo.css'

export const WeatherInfo = props =>
  <div className="weather-info">
    <span className="close" onClick={() => props.onClose(props.id)}>&times;</span>
    <h2 className="weather-info__location">
      {`Weather in ${props.location}`}
    </h2>
    <h3 className="weather-info__temperature">
      <img src={props.imageUrl} alt={`Weather in ${props.location}`}></img>
      &nbsp;
      {props.currentTemp} &deg;C
      &nbsp;
      <span className="weather-info__temp-range">
        (min: {props.minTemp} &deg;C, max: {props.maxTemp} &deg;C)
      </span>
    </h3>
    <p className="weather-info__description">
      {sentenceCase(props.description)}
    </p>
    <ul className="weatherInfo__list">
      <li className="weatherInfo__list-item">
        Humidity: {props.humidity}%
      </li>
      <li className="weatherInfo__list-item">
        Pressure: {props.pressure} hPa
      </li>
      <li className="weatherInfo__list-item">
        Wind speed: {props.windSpeed} m/s
      </li>
    </ul>
  </div>

WeatherInfo.propTypes = {
  id: PropTypes.number,
  location: PropTypes.string,
  country: PropTypes.string,
  city: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  currentTemp: PropTypes.number,
  minTemp: PropTypes.number,
  maxTemp: PropTypes.number,
  humidity: PropTypes.number,
  pressure: PropTypes.number,
  windSpeed: PropTypes.number,
  onClose: PropTypes.func.isRequired
}
