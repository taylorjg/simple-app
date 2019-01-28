import React from 'react'
import PropTypes from 'prop-types'
import './ErrorPanel.css'

export const ErrorPanel = props =>
  props.errorMessage &&
  <div className="error-panel alert alert-danger">
    <span className="close" onClick={props.onClose}>&times;</span>
    <span>{props.errorMessage}</span>
  </div>

ErrorPanel.propTypes = {
  errorMessage: PropTypes.string,
  onClose: PropTypes.func.isRequired
}
