import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CountryPicker } from './CountryPicker'
import { LocationPicker } from './LocationPicker'
import { Location } from './Location'
import { defaultCountry } from './countries'
import log from 'loglevel'
import './PreferencesView.css'

export const PreferencesView = ({
  locations,
  onAddLocation,
  onRemoveLocation,
  onShowErrorMessage
}) => {

  const [selectedCountry, setSelectedCountry] = useState(defaultCountry)
  const [selectedLocation, setSelectedLocation] = useState(undefined)
  const countryPickerRef = useRef()
  const locationPickerRef = useRef()

  const onChangeCountry = country => {
    log.info(`[PreferencesView#onChangeCountry] country: ${JSON.stringify(country)}`)
    setSelectedCountry(country)
  }

  const onChangeLocation = location => {
    log.info(`[PreferencesView#onChangeLocation] location: ${JSON.stringify(location)}`)
    setSelectedLocation(location)
  }

  const clearLocation = () => {
    setSelectedLocation(undefined)
    locationPickerRef.current.clear()
  }

  const onClear = () => {
    setSelectedCountry(undefined)
    setSelectedLocation(undefined)
    countryPickerRef.current.clear()
    locationPickerRef.current.clear()
  }

  const onAdd = e => {
    log.info(`[PreferencesView#onAdd] selectedLocation: ${JSON.stringify(selectedLocation)}`)
    e.preventDefault()
    if (locations.some(location => location.id === selectedLocation.id)) {
      onShowErrorMessage(`Duplicate location, "${selectedLocation.displayName}".`)
      return
    }
    onAddLocation(selectedLocation)
    clearLocation()
  }

  const onDelete = id => {
    log.info(`[PreferencesView#onDelete] id: ${id}`)
    onRemoveLocation(id)
  }

  const renderLocations = () =>
    locations.map(location =>
      <Location
        key={location.id}
        location={location}
        onDelete={onDelete}
      />
    )

  const renderForm = () => {
    return (
      <form>
        <div className="form-group form-group-sm">
          <label htmlFor="country">Search for a country:</label>
          <CountryPicker
            id="country"
            ref={countryPickerRef}
            selectedCountry={selectedCountry}
            onChangeCountry={onChangeCountry}
          />
        </div>
        <div className="form-group form-group-sm">
          <label htmlFor="location">Search for a location:</label>
          <LocationPicker
            id="location"
            ref={locationPickerRef}
            selectedCountry={selectedCountry}
            selectedLocation={selectedLocation}
            onChangeLocation={onChangeLocation}
          />
        </div>
        <button
          type="submit"
          className="btn btn-xs btn-primary"
          disabled={!selectedLocation}
          onClick={onAdd}
        >Add</button>
        <button
          type="button"
          className="btn btn-xs btn-default"
          disabled={!selectedCountry && !selectedLocation}
          onClick={onClear}
        >Clear</button>
      </form>
    )
  }

  return (
    <div className="preferences">
      <div className="row">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          {renderForm()}
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          {renderLocations()}
        </div>
      </div>
    </div>
  )
}

PreferencesView.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    country: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired
  })).isRequired,
  onAddLocation: PropTypes.func.isRequired,
  onRemoveLocation: PropTypes.func.isRequired,
  onShowErrorMessage: PropTypes.func.isRequired
}
