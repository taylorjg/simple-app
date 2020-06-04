import React, { useCallback, useRef, useState } from 'react'
import { search } from '../../services/locations'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export const LocationPicker = ({ id, country, onChangeLocation }) => {
  const ref = useRef()
  const [matchingLocations, setMatchingLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const onSearch = useCallback(async input => {
    try {
      setLoading(true)
      const matchingLocations = await search(input, country.code)
      setMatchingLocations(matchingLocations)
    } finally {
      setLoading(false)
    }
  }, [country, setMatchingLocations, setLoading])
  
  return (
    <AsyncTypeahead
      id={`${id}-typeahead`}
      ref={ref}
      inputProps={{ id }}
      size="sm"
      disabled={!country}
      isLoading={loading}
      onSearch={onSearch}
      onChange={onChangeLocation}
      labelKey='city'
      options={matchingLocations}
    />
  )
}
