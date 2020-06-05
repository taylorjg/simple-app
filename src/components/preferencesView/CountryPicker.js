import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Typeahead } from 'react-bootstrap-typeahead'
import { countries } from './countries'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export const CountryPicker = forwardRef(({
  id,
  selectedCountry,
  onChangeCountry
}, ref) => {
  return (
    <Typeahead
      id={`${id}-typeahead`}
      ref={ref}
      inputProps={{ id }}
      size="sm"
      onChange={onChangeCountry}
      labelKey='name'
      options={countries}
      defaultSelected={selectedCountry ? [selectedCountry] : []}
    />
  )
})

CountryPicker.propTypes = {
  id: PropTypes.string.isRequired,
  selectedCountry: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired
  }),
  onChangeCountry: PropTypes.func.isRequired
}
