import React from 'react'
import PropTypes from 'prop-types'
import './ErrorPanel.css'

export const ErrorPanel = ({ errorMessage, onClose }) =>
  errorMessage && (
    <div className="error-panel alert alert-danger">
      <span className="close" onClick={onClose}>&times;</span>
      <span>{errorMessage}</span>
    </div>
  )

ErrorPanel.propTypes = {
  errorMessage: PropTypes.string,
  onClose: PropTypes.func.isRequired
}
