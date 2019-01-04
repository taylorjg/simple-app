import React from 'react'
import PropTypes from 'prop-types'
import './WeatherInfo.css'

export const WeatherInfo = props =>
  <div className="weatherInfo">
    <ul>
      <li>Location: {`${props.city}, ${props.country}`}</li>
      <li>Description: {props.description}</li>
      <li>Current temperature: {props.temp} &deg;C</li>
      <li>Minimum temperature: {props.tempMin} &deg;C</li>
      <li>Maximum temperature: {props.tempMax} &deg;C</li>
      <img alt={props.icon} src={`http://openweathermap.org/img/w/${props.icon}.png`}></img>
    </ul>
  </div>

WeatherInfo.propTypes = {
  country: PropTypes.string,
  city: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.string,
  temp: PropTypes.number,
  tempMin: PropTypes.number,
  tempMax: PropTypes.number
}
