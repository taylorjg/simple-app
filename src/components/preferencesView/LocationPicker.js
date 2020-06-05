import React, { useCallback, forwardRef, useState } from 'react'
import PropTypes from 'prop-types'
import { search } from '../../services/locations'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export const LocationPicker = forwardRef(({
  id,
  selectedCountry,
  selectedLocation,
  onChangeLocation
}, ref) => {
  const [matchingLocations, setMatchingLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const onSearch = useCallback(async input => {
    try {
      setLoading(true)
      const matchingLocations = await search(input, selectedCountry.code)
      setMatchingLocations(matchingLocations)
    } finally {
      setLoading(false)
    }
  }, [selectedCountry, setMatchingLocations, setLoading])

  return (
    <AsyncTypeahead
      id={`${id}-typeahead`}
      ref={ref}
      inputProps={{ id }}
      size="sm"
      disabled={!selectedCountry}
      isLoading={loading}
      onSearch={onSearch}
      onChange={onChangeLocation}
      labelKey='city'
      options={matchingLocations}
      defaultSelected={selectedLocation ? [selectedLocation] : []}
    />
  )
})

LocationPicker.propTypes = {
  id: PropTypes.string.isRequired,
  selectedCountry: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }),
  selectedLocation: PropTypes.shape({
    id: PropTypes.number.isRequired,
    country: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired
  }),
  onChangeLocation: PropTypes.func.isRequired
}
