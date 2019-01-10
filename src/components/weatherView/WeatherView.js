import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { ErrorPanel } from './ErrorPanel'
import { WeatherInfo } from './WeatherInfo'
import { WeatherInfoLoader } from './loaders/WeatherInfoLoader'
import { getWeatherInfo } from '../../services/weatherInfo'
import './WeatherView.css'

export class WeatherView extends Component {

  constructor(props) {
    super(props)
    this.locationIds = props.locations.map(location => location.id)
    this.placeHolders = props.locations.map(location => ({ id: location.id }))
    this.state = {
      weatherInfos: this.placeHolders,
      busy: false,
      errorMessage: null
    }
  }

  componentDidMount() {
    console.log(`[WeatherView#componentDidMount]`)
    this.getWeatherInfos()
  }

  componentDidCatch(error, info) {
    console.error(`[WeatherView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  async getWeatherInfos() {
    try {
      console.log(`[WeatherView#getWeatherInfos]`)
      this.setState({ busy: true })
      const weatherInfos = await getWeatherInfo(this.locationIds)
      this.setState({ weatherInfos })
    } catch (error) {
      console.error(`[WeatherView#getWeatherInfos] ${error.message}`)
      this.setState({
        weatherInfos: [],
        errorMessage: error.message
      })
    } finally {
      setTimeout(() => {
        this.setState({ busy: false })
      }, 250)
    }
  }

  onRefresh() {
    console.log(`[WeatherView#onRefresh]`)
    this.getWeatherInfos()
  }

  onCloseErrorPanel() {
    console.log(`[WeatherView#onCloseErrorPanel]`)
    this.setState({ errorMessage: null })
  }

  renderWeatherInfos() {
    console.log(`[WeatherView#renderWeatherInfos]`)
    return this.state.weatherInfos.map(weatherInfo =>
      this.state.busy
        ? <WeatherInfoLoader key={weatherInfo.id} />
        : <WeatherInfo key={weatherInfo.id} {...weatherInfo} />)
  }

  render() {
    return <div>
      <div className="row">
        <div className="row-margins">
          <Link to="/preferences" className="btn btn-xs btn-primary">
            Preferences
          </Link>
          <div className="pull-right">
            {
              this.state.busy &&
              <img className="busy-indicator" alt="busy indicator" src="/spinner.gif" />
            }
            <span className="btn btn-xs btn-success" title="Refresh"
              disabled={this.state.busy}
              onClick={this.onRefresh.bind(this)}
            ><i className="fas fa-redo"></i></span>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="row-margins">
          <ErrorPanel errorMessage={this.state.errorMessage}
            onClose={this.onCloseErrorPanel.bind(this)} />
        </div>
      </div>
      <div className="row">
        <div className="weatherView">
          {this.state.weatherInfos && this.renderWeatherInfos()}
        </div>
      </div>
    </div>
  }
}

WeatherView.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object).isRequired
}
