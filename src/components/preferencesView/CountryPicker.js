import React, { useRef } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { countries, defaultCountry } from './countries'
import 'react-bootstrap-typeahead/css/Typeahead.css'

export const CountryPicker = ({ id, onChangeCountry }) => {
  const ref = useRef()
  
  return (
    <Typeahead
      id={`${id}-typeahead`}
      ref={ref}
      inputProps={{ id }}
      size="sm"
      onChange={onChangeCountry}
      labelKey='name'
      options={countries}
      defaultSelected={[defaultCountry]}
    />
  )
}
