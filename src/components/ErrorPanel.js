import React from 'react'
import PropTypes from 'prop-types'
import './ErrorPanel.css'

export const formatAxiosError = (error, baseMessage) =>
  error && error.response && error.response.status && error.response.statusText
    ? `${baseMessage} (${error.response.status} ${error.response.statusText}).`
    : `${baseMessage}.`

export const ErrorPanel = props =>
  props.errorMessage &&
  <div className="error-panel alert alert-danger">
    <span className="close"
      onClick={() => props.onClose && props.onClose()}
    >&times;
      </span>
    <span>{props.errorMessage}</span>
  </div>

ErrorPanel.propTypes = {
  errorMessage: PropTypes.string,
  onClose: PropTypes.func
}
