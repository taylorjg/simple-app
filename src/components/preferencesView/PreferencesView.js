import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withHeader } from '../common/Header'
import { Location } from './Location'
import { search } from '../../services/locations'
import { Typeahead, AsyncTypeahead } from 'react-bootstrap-typeahead'
import { countries, defaultCountry } from './countries'
import * as log from 'loglevel'
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

  onClear = () => {
    this.setState({
      matchingCountries: [],
      selectedCountry: null,
      matchingLocations: [],
      selectedLocation: null
    })
    this.countryTypeahead.getInstance().clear()
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
            ref={countryTypeahead => this.countryTypeahead = countryTypeahead}
            inputProps={{ id: 'country' }}
            bsSize="sm"
            onChange={this.onCountryChange}
            labelKey='name'
            options={countries}
            defaultSelected={[defaultCountry]}
          />
        </div>
        <div className="form-group form-group-sm">
          <label htmlFor="city">Search for a city:</label>
          <AsyncTypeahead
            ref={cityTypeahead => this.cityTypeahead = cityTypeahead}
            inputProps={{ id: 'city' }}
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
  showErrorMessage: PropTypes.func.isRequired,
  clearErrorMessage: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  addLocation: PropTypes.func.isRequired,
  removeLocation: PropTypes.func.isRequired
}

export const PreferencesViewWithHeader = withHeader(PreferencesView)
