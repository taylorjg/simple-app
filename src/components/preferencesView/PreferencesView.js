import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Location } from './Location'
import { search } from '../../services/locations'
import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead'
import { countries, defaultCountry } from './countries'
import log from 'loglevel'
import 'react-bootstrap-typeahead/css/Typeahead.css'
import './PreferencesView.css'

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      busy: false,
      matchingCountries: [],
      selectedCountry: defaultCountry,
      matchingLocations: [],
      selectedLocation: null
    }
  }

  componentDidCatch(error, info) {
    log.error(`[PreferencesView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  onCountryChange = async selectedItems => {
    log.info(`[PreferencesView#onCountryChange] selectedItems: ${JSON.stringify(selectedItems)}`)
    const selectedCountry = selectedItems[0]
    this.setState({ selectedCountry })
  }

  onCitySearch = async input => {
    try {
      log.info(`[PreferencesView#onCitySearch] input: ${input}`)
      this.setState({ busy: true })
      const matchingLocations = await search(input, this.state.selectedCountry.code)
      this.setState({ matchingLocations })
    } catch (error) {
      log.error(`[PreferencesView#onCitySearch] ${error.message}`)
      this.setState({ matchingLocations: [] })
      this.props.onShowErrorMessage(error.message)
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
    this.cityTypeahead.clear()
  }

  onClear = () => {
    this.setState({
      matchingCountries: [],
      selectedCountry: null,
      matchingLocations: [],
      selectedLocation: null
    })
    this.countryTypeahead.clear()
    this.cityTypeahead.clear()
  }

  onAdd = e => {
    log.info(`[PreferencesView#onAdd] selectedLocation: ${JSON.stringify(this.state.selectedLocation)}`)
    e.preventDefault()
    this.clearCity()
    const existingLocation =
      this.props.locations.find(location =>
        location.id === this.state.selectedLocation.id)
    if (existingLocation) {
      this.props.onShowErrorMessage(`Duplicate location, "${this.state.selectedLocation.location}".`)
      return
    }
    this.props.onAddLocation(this.state.selectedLocation)
  }

  onDelete = id => {
    log.info(`[PreferencesView#onDelete] id: ${id}`)
    this.props.onRemoveLocation(id)
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

  renderForm() {
    return (
      <form>
        <div className="form-group form-group-sm">
          <label htmlFor="country">Search for a country:</label>
          <Typeahead
            id="country-typeahead"
            ref={countryTypeahead => this.countryTypeahead = countryTypeahead}
            inputProps={{ id: 'country' }}
            size="sm"
            onChange={this.onCountryChange}
            labelKey='name'
            options={countries}
            defaultSelected={[defaultCountry]}
          />
        </div>
        <div className="form-group form-group-sm">
          <label htmlFor="city">Search for a city:</label>
          <AsyncTypeahead
            id="city-typeahead"
            ref={cityTypeahead => this.cityTypeahead = cityTypeahead}
            inputProps={{ id: 'city' }}
            size="sm"
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
        <button type="button" className="btn btn-xs btn-default"
          disabled={!this.state.selectedCountry && !this.state.selectedLocation}
          onClick={this.onClear}>Clear</button>
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
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    country: PropTypes.string.isRequired
  })).isRequired,
  onAddLocation: PropTypes.func.isRequired,
  onRemoveLocation: PropTypes.func.isRequired,
  onShowErrorMessage: PropTypes.func.isRequired
}
