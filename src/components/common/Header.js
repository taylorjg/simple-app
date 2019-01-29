import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { NavigationLinks } from './NavigationLinks'
import { ErrorPanel } from './ErrorPanel'
import './Header.css'

export class Header extends Component {

  render() {
    return (
      <div>
        <div className="row">
          <div className="row-margins">
            <NavigationLinks />
          </div>
        </div>
        <div className="row">
          <div className="row-margins">
            <ErrorPanel errorMessage={this.props.errorMessage}
              onClose={this.props.clearErrorMessage} />
          </div>
        </div>
      </div>
    )
  }
}

Header.propTypes = {
  errorMessage: PropTypes.string,
  clearErrorMessage: PropTypes.func.isRequired
}

export const withHeader = ViewComponent => {

  return class extends Component {

    constructor(props) {
      super(props)
      this.state = {
        errorMessage: ''
      }
    }

    showErrorMessage = errorMessage => {
      this.setState({ errorMessage })
    }

    clearErrorMessage = () => {
      this.setState({ errorMessage: '' })
    }

    render() {
      return (
        <div>
          <Header
            errorMessage={this.state.errorMessage}
            clearErrorMessage={this.clearErrorMessage}
          />
          <ViewComponent
            showErrorMessage={this.showErrorMessage}
            clearErrorMessage={this.clearErrorMessage}
            {...this.props}
          />
        </div>
      )
    }
  }
}
