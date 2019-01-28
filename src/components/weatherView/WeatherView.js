import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withHeader } from '../common/Header'
import { WeatherInfo } from './WeatherInfo'
import { WeatherInfoLoader } from './loaders/WeatherInfoLoader'
import { getWeatherInfo } from '../../services/weatherInfo'
import * as log from 'loglevel'
import './WeatherView.css'

export class WeatherView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      weatherInfos: [],
      busy: false
    }
  }

  componentDidMount() {
    log.info(`[WeatherView#componentDidMount]`)
    this.getWeatherInfos()
  }

  componentDidUpdate(prevProps) {
    log.info(`[WeatherView#componentDidUpdate]`)
    if (this.props.locations.length !== prevProps.locations.length) {
      this.getWeatherInfos()
    }
  }

  componentDidCatch(error, info) {
    log.error(`[WeatherView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  async getWeatherInfos() {
    try {
      log.info(`[WeatherView#getWeatherInfos]`)
      const locationIds = this.props.locations.map(location => location.id)
      const placeHolders = this.props.locations.map(location => ({ id: location.id }))
      this.setState({
        weatherInfos: placeHolders,
        busy: true
      })
      const weatherInfos = await getWeatherInfo(locationIds)
      this.setState({ weatherInfos })
    } catch (error) {
      log.error(`[WeatherView#getWeatherInfos] ${error.message}`)
      this.setState({ weatherInfos: [] })
      this.props.showErrorMessage(error.message)
    } finally {
      setTimeout(() => {
        this.setState({ busy: false })
      }, 250)
    }
  }

  onRefresh() {
    log.info(`[WeatherView#onRefresh]`)
    this.getWeatherInfos()
  }

  renderRightContent() {
    return (
      <div className="pull-right">
        {
          this.state.busy &&
          <img className="busy-indicator" alt="busy indicator" src="/spinner.gif" />
        }
        <span className="btn btn-xs btn-success" title="Refresh"
          disabled={this.state.busy}
          onClick={this.onRefresh.bind(this)}
        >
          <i className="fas fa-redo"></i>
        </span>
      </div>
    )
  }

  renderWeatherInfos() {
    log.info(`[WeatherView#renderWeatherInfos]`)
    return this.state.weatherInfos.map(weatherInfo =>
      this.state.busy
        ? <WeatherInfoLoader key={weatherInfo.id} />
        : <WeatherInfo key={weatherInfo.id} {...weatherInfo}
          onClose={this.props.removeLocation}
        />)
  }

  render() {
    return <div>
      <div className="row">
        <div className="row-margins">
          {this.renderRightContent()}
        </div>
      </div>
      <div className="row">
        <div className="weatherView">
          {this.renderWeatherInfos()}
        </div>
      </div>
    </div>
  }
}

WeatherView.propTypes = {
  showErrorMessage: PropTypes.func.isRequired,
  clearErrorMessage: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeLocation: PropTypes.func.isRequired
}

export const WeatherViewWithHeader = withHeader(WeatherView)
