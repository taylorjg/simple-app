import React, { useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { withHeader } from '../common/Header'
import { WeatherInfo } from './WeatherInfo'
import { withLoader } from '../common/Loader'
import { getWeatherInfo } from '../../services/weatherInfo'
import * as log from 'loglevel'
import './WeatherView.css'

const PLACEHOLDER = {
  id: 2643123,
  location: 'Manchester, GB',
  country: 'GB',
  city: 'Manchester',
  description: 'Scattered clouds',
  imageUrl: 'https://openweathermap.org/img/w/03d.png',
  currentTemp: 0,
  minTemp: 0,
  maxTemp: 0,
  humidity: 100,
  pressure: 1030,
  windSpeed: 2
}

const WeatherInfoWithLoader = withLoader(WeatherInfo)

const WeatherView = ({
  locations,
  removeLocation,
  showErrorMessage
}) => {
  const [weatherInfos, setWeatherInfos] = useState([])
  const [busy, setBusy] = useState(false)

  const getWeatherInfos = useCallback(async () => {
    try {
      log.info(`[WeatherView#getWeatherInfos]`)
      const locationIds = locations.map(location => location.id)
      const placeHolders = locations.map(location => ({ id: location.id }))
      setWeatherInfos(placeHolders)
      setBusy(true)
      const weatherInfos = await getWeatherInfo(locationIds)
      setWeatherInfos(weatherInfos)
    } catch (error) {
      log.error(`[WeatherView#getWeatherInfos] ${error.message}`)
      setWeatherInfos([])
      showErrorMessage(error.message)
    } finally {
      setTimeout(() => {
        setBusy(false)
      }, 250)
    }
  }, [locations, showErrorMessage])

  useEffect(() => { getWeatherInfos() }, [getWeatherInfos])

  const onRefresh = () => {
    log.info(`[WeatherView#onRefresh]`)
    getWeatherInfos()
  }

  const renderRightContent = () => {
    return (
      <div className="pull-right">
        {
          busy && <img className="busy-indicator" alt="busy indicator" src="/spinner.gif" />
        }
        <span className="btn btn-xs btn-success" title="Refresh"
          disabled={busy}
          onClick={onRefresh}
        >
          <i className="fas fa-redo"></i>
        </span>
      </div>
    )
  }

  const renderWeatherInfos = () => {
    log.info(`[WeatherView#renderWeatherInfos]`)
    return weatherInfos.map((weatherInfo, index) =>
      <WeatherInfoWithLoader
        isLoading={busy}
        key={index}
        {...busy ? PLACEHOLDER : weatherInfo}
        onClose={removeLocation}
      />
    )
  }

  return (
    <div>
      <div className="row">
        <div className="row-margins">
          {renderRightContent()}
        </div>
      </div>
      <div className="row">
        <div className="weatherView">
          {renderWeatherInfos()}
        </div>
      </div>
    </div>
  )
}

WeatherView.propTypes = {
  showErrorMessage: PropTypes.func.isRequired,
  clearErrorMessage: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeLocation: PropTypes.func.isRequired
}

export const WeatherViewWithHeader = withHeader(WeatherView)
