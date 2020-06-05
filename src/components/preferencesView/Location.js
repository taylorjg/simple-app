import React from 'react'
import PropTypes from 'prop-types'
import './Location.css'

export const Location = ({ location, onDelete }) =>
  <div className="location-item">
    <span className="location-item__location">{location.displayName}</span>
    <span className="location-item__delete-button btn btn-xs btn-default"
      title="Delete"
      onClick={() => onDelete(location.id)}
    >
      &times;
    </span>
  </div>

Location.propTypes = {
  location: PropTypes.shape({
    id: PropTypes.number.isRequired,
    country: PropTypes.string.isRequired,
    city: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired
}
