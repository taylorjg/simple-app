import React from 'react'
import PropTypes from 'prop-types'
import './WeatherInfo.css'

export const WeatherInfo = props =>
  <div className="weatherInfo">
    <ul>
      <li>Location: {`${props.city}, ${props.country}`}</li>
      <li>Description: {props.description}</li>
      <li>Temp {props.temp}</li>
      <li>Min Temp: {props.tempMin}</li>
      <li>Max Temp: {props.tempMax}</li>
    </ul>
  </div>

WeatherInfo.propTypes = {
  country: PropTypes.string,
  city: PropTypes.string,
  description: PropTypes.string,
  temp: PropTypes.number,
  tempMin: PropTypes.number,
  tempMax: PropTypes.number
}
