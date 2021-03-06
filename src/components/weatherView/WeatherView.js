import React, { useCallback, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { IconButton } from '@chakra-ui/core'
import { WeatherInfo } from './WeatherInfo'
import { withLoader } from '../common/Loader'
import { getWeatherInfo } from '../../services/weatherInfo'
import log from 'loglevel'
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

export const WeatherView = ({
  locations,
  onRemoveLocation,
  onShowErrorMessage
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
      onShowErrorMessage(error.message)
    } finally {
      setTimeout(() => {
        setBusy(false)
      }, 250)
    }
  }, [locations, onShowErrorMessage])

  useEffect(() => { getWeatherInfos() }, [getWeatherInfos])

  const onRefresh = () => {
    log.info(`[WeatherView#onRefresh]`)
    getWeatherInfos()
  }

  const renderControls = () => {
    return (
      <div className="pull-right">
        <IconButton
          icon="repeat"
          size="lg"
          aria-label="Refresh"
          variantColor="green"
          isDisabled={busy}
          isLoading={busy}
          onClick={onRefresh}
        />
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
        onClose={onRemoveLocation}
      />
    )
  }

  return (
    <div>
      <div className="row">
        <div className="row-margins">
          {renderControls()}
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
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    country: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired
  })).isRequired,
  onRemoveLocation: PropTypes.func.isRequired,
  onShowErrorMessage: PropTypes.func.isRequired
}
