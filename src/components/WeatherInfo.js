import React from 'react'
import PropTypes from 'prop-types'
import './WeatherInfo.css'

export const WeatherInfo = props =>
  <div className="weatherInfo">
    <ul>
      <li>Location: {`${props.city}, ${props.country}`}</li>
      <li>Description: {props.description}</li>
      <li>Current temperature: {props.currentTemp} &deg;C</li>
      <li>Minimum temperature: {props.minTemp} &deg;C</li>
      <li>Maximum temperature: {props.maxTemp} &deg;C</li>
      <img alt={props.description} src={props.imageUrl}></img>
    </ul>
  </div>

WeatherInfo.propTypes = {
  country: PropTypes.string,
  city: PropTypes.string,
  description: PropTypes.string,
  imageUrl: PropTypes.string,
  currentTemp: PropTypes.number,
  minTemp: PropTypes.number,
  maxTemp: PropTypes.number
}
