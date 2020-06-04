import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavigationLinks } from './NavigationLinks'
import { ErrorPanel } from './ErrorPanel'
import './Header.css'

export const Header = ({ errorMessage, onClearErrorMessage }) => {
  return (
    <div>
      <div className="row">
        <div className="row-margins">
          <NavigationLinks />
        </div>
      </div>
      <div className="row">
        <div className="row-margins">
          <ErrorPanel errorMessage={errorMessage}
            onClose={onClearErrorMessage} />
        </div>
      </div>
    </div>
  )
}

Header.propTypes = {
  errorMessage: PropTypes.string,
  onClearErrorMessage: PropTypes.func.isRequired
}

export const withHeader = ViewComponent => {

  return class extends Component {

    constructor(props) {
      super(props)
      this.state = {
        errorMessage: ''
      }
    }

    onShowErrorMessage = errorMessage => {
      this.setState({ errorMessage })
    }

    onClearErrorMessage = () => {
      this.setState({ errorMessage: '' })
    }

    render() {
      return (
        <div>
          <Header
            errorMessage={this.state.errorMessage}
            onClearErrorMessage={this.onClearErrorMessage}
          />
          <ViewComponent
            onShowErrorMessage={this.onShowErrorMessage}
            onClearErrorMessage={this.onClearErrorMessage}
            {...this.props}
          />
        </div>
      )
    }
  }
}
