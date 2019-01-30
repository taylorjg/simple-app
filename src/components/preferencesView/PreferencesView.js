import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withHeader } from '../common/Header'
import { Location } from './Location'
import { search } from '../../services/locations'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import * as log from 'loglevel'
import './PreferencesView.css'

const COUNTRIES = [
  {
    name: 'Australia',
    code: 'AU'
  },
  {
    name: 'Austria',
    code: 'AT'
  },
  {
    name: 'Belgium',
    code: 'BE'
  },
  {
    name: 'Brazil',
    code: 'BR'
  },
  {
    name: 'Czech Republic',
    code: 'CZ'
  },
  {
    name: 'Denmark',
    code: 'DK'
  },
  {
    name: 'Finland',
    code: 'FI'
  },
  {
    name: 'France',
    code: 'FR'
  },
  {
    name: 'Germany',
    code: 'DE'
  },
  {
    name: 'Italy',
    code: 'IT'
  },
  {
    name: 'Ireland',
    code: 'IE'
  },
  {
    name: 'Netherlands',
    code: 'NL'
  },
  {
    name: 'Poland',
    code: 'PL'
  },
  {
    name: 'Portugal',
    code: 'PT'
  },
  {
    name: 'Spain',
    code: 'ES'
  },
  {
    name: 'Switzerland',
    code: 'CH'
  },
  {
    name: 'United Kingdom',
    code: 'GB'
  },
  {
    name: 'United States of America',
    code: 'US'
  }
]

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      busy: false,
      selectedCountry: 'GB',
      matchingLocations: [],
      selectedLocation: null
    }
  }

  componentDidCatch(error, info) {
    log.error(`[PreferencesView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  onCountryChange = e => {
    const selectedCountry = e.target.value
    log.info(`[PreferencesView#onCountryChange] selectedCountry: ${selectedCountry}`)
    this.setState({ selectedCountry })
    if (!selectedCountry) this.clearCity()
  }

  onCitySearch = async input => {
    try {
      log.info(`[PreferencesView#onCitySearch] input: ${input}`)
      this.setState({ busy: true })
      const matchingLocations = await search(input, this.state.selectedCountry)
      this.setState({ matchingLocations })
      this.props.clearErrorMessage()
    } catch (error) {
      log.error(`[PreferencesView#onCitySearch] ${error.message}`)
      this.setState({ matchingLocations: [] })
      this.props.showErrorMessage(error.message)
    } finally {
      this.setState({ busy: false })
    }
  }

  onCityChange = selectedItems => {
    log.info(`[PreferencesView#onCityChange] selectedItems: ${JSON.stringify(selectedItems)}`)
    const selectedLocation = selectedItems[0]
    this.setState({ selectedLocation })
  }

  clearCity = () => {
    this.setState({
      matchingLocations: [],
      selectedLocation: null
    })
    this.cityTypeahead.getInstance().clear()
  }

  onAdd = e => {
    log.info(`[PreferencesView#onAdd] selectedLocation: ${JSON.stringify(this.state.selectedLocation)}`)
    e.preventDefault()
    this.clearCity()
    const existingLocation =
      this.props.locations.find(location =>
        location.id === this.state.selectedLocation.id)
    if (existingLocation) {
      this.props.showErrorMessage(`Duplicate location, "${this.state.selectedLocation.location}".`)
      return
    }
    this.props.addLocation(this.state.selectedLocation)
  }

  onDelete = id => {
    log.info(`[PreferencesView#onDelete] id: ${id}`)
    this.props.removeLocation(id)
  }

  renderItem = (match, isHighlighted) => {
    const className = isHighlighted ? 'bg-primary' : ''
    return (
      <div key={match.id} className={className}>
        {match.location}
      </div>
    )
  }

  renderLocations() {
    return this.props.locations.map(location =>
      <Location
        key={location.id}
        location={location}
        onDelete={this.onDelete}
      />
    )
  }

  renderCountry(country) {
    return (
      <option key={country.code} value={country.code}>
        {country.name}
      </option>
    )
  }

  renderForm() {
    return (
      <form>
        <div className="form-group form-group-sm">
          <label htmlFor="country">Select a country:</label>
          <select id="country" className="form-control form-control-sm"
            onChange={this.onCountryChange} defaultValue={this.state.selectedCountry}
          >
            {COUNTRIES.map(country => this.renderCountry(country))}
          </select>
        </div>
        <div className="form-group form-group-sm">
          <label htmlFor="city">Search for a city:</label>
          <AsyncTypeahead
            inputProps={{ id: 'city' }}
            ref={cityTypeahead => this.cityTypeahead = cityTypeahead}
            bsSize="sm"
            disabled={!this.state.selectedCountry}
            isLoading={this.state.busy}
            onSearch={this.onCitySearch}
            onChange={this.onCityChange}
            labelKey='city'
            options={this.state.matchingLocations}
          />
        </div>
        <button type="submit" className="btn btn-xs btn-primary"
          disabled={!this.state.selectedLocation}
          onClick={this.onAdd}>Add</button>
      </form>
    )
  }

  render() {
    return <div className="preferences">
      <div className="row">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          {this.renderForm()}
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          {this.renderLocations()}
        </div>
      </div>
    </div>
  }
}

PreferencesView.propTypes = {
  showErrorMessage: PropTypes.func.isRequired,
  clearErrorMessage: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  addLocation: PropTypes.func.isRequired,
  removeLocation: PropTypes.func.isRequired
}

export const PreferencesViewWithHeader = withHeader(PreferencesView)
