import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { CountryPicker } from './CountryPicker'
import { LocationPicker } from './LocationPicker'
import { Location } from './Location'
import { defaultCountry } from './countries'
import log from 'loglevel'
import './PreferencesView.css'

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedCountry: defaultCountry,
      selectedLocation: null
    }
  }

  onChangeCountry = async selectedItems => {
    log.info(`[PreferencesView#onChangeCountry] selectedItems: ${JSON.stringify(selectedItems)}`)
    const selectedCountry = selectedItems[0]
    this.setState({ selectedCountry })
  }

  onChangeLocation = selectedItems => {
    log.info(`[PreferencesView#onChangeLocation] selectedItems: ${JSON.stringify(selectedItems)}`)
    const selectedLocation = selectedItems[0]
    this.setState({ selectedLocation })
  }

  clearLocation = () => {
    this.setState({
      selectedLocation: null
    })
    // this.locationTypeahead.clear()
  }

  onClear = () => {
    this.setState({
      selectedCountry: null,
      selectedLocation: null
    })
    // this.countryTypeahead.clear()
    // this.locationTypeahead.clear()
  }

  onAdd = e => {
    log.info(`[PreferencesView#onAdd] selectedLocation: ${JSON.stringify(this.state.selectedLocation)}`)
    e.preventDefault()
    this.clearLocation()
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
          <CountryPicker id="country" onChangeCountry={this.onChangeCountry} />
        </div>
        <div className="form-group form-group-sm">
          <label htmlFor="location">Search for a location:</label>
          <LocationPicker id="location" country={this.state.selectedCountry} onChangeLocation={this.onChangeLocation} />
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
