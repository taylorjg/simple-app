import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withHeader } from '../common/Header'
import { Location } from './Location'
import { search } from '../../services/locations'
import Autocomplete from 'react-autocomplete'
import * as log from 'loglevel'
import './PreferencesView.css'

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      searchValue: '',
      matches: [],
      selectedMatch: null
    }
  }

  componentDidCatch(error, info) {
    log.error(`[PreferencesView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  onAutocompleteChange = async (_, searchValue) => {
    try {
      log.info(`[PreferencesView#onAutocompleteChange] searchValue: ${searchValue}`)
      this.setState({ searchValue })
      const matches = await search(searchValue)
      this.setState({ matches })
      this.props.clearErrorMessage()
    } catch (error) {
      log.error(`[PreferencesView#onAutocompleteChange] ${error.message}`)
      this.setState({ matches: [] })
      this.props.showErrorMessage(error.message)
    }
  }

  onAutocompleteSelect = (searchValue, selectedMatch) => {
    log.info(`[PreferencesView#onAutocompleteSelect] searchValue: ${searchValue}; selectedMatch: ${JSON.stringify(selectedMatch)}`)
    if (selectedMatch.city && selectedMatch.country) {
      this.setState({
        searchValue,
        selectedMatch
      })
    }
  }

  onAdd = e => {
    log.info(`[PreferencesView#onAdd] selectedMatch: ${JSON.stringify(this.state.selectedMatch)}`)
    e.preventDefault()
    this.setState({
      searchValue: '',
      matches: [],
      selectedMatch: null
    })
    const existingLocation =
      this.props.locations.find(location =>
        location.id === this.state.selectedMatch.id)
    if (existingLocation) {
      this.props.showErrorMessage(`Duplicate location, "${this.state.selectedMatch.location}".`)
      return
    }
    this.props.addLocation(this.state.selectedMatch)
  }

  onDelete = id => {
    log.info(`[PreferencesView#onDelete] id: ${id}`)
    this.props.removeLocation(id)
  }

  renderItem = (match, isHighlighted) => {
    const className = isHighlighted ? 'bg-primary' : ''
    return (
      <div key={match.id} className={className}>
        {match.location}
      </div>
    )
  }

  renderLocations() {
    return this.props.locations.map(location =>
      <Location
        key={location.id}
        location={location}
        onDelete={this.onDelete}
      />
    )
  }

  renderForm() {

    // https://github.com/reactjs/react-autocomplete/issues/282#issuecomment-335477132
    const menuStyle = {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 1)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'fixed',
      overflow: 'auto',
      maxHeight: '50%',
      zIndex: 100
    }

    return (
      <form>
        <div className="form-group form-group-sm">
          <label htmlFor="search">Search for a city:</label>
          <Autocomplete
            inputProps={{ id: 'search', className: 'form-control form-control-sm' }}
            wrapperStyle={{ display: 'block' }}
            value={this.state.searchValue}
            items={this.state.matches}
            getItemValue={match => match.city}
            onChange={this.onAutocompleteChange}
            onSelect={this.onAutocompleteSelect}
            renderItem={this.renderItem}
            menuStyle={menuStyle}
          />
        </div>
        <button type="submit" className="btn btn-xs btn-primary"
          disabled={!this.state.selectedMatch}
          onClick={this.onAdd}>Add</button>
      </form>
    )
  }

  render() {
    return <div className="preferences">
      <div className="row">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          {this.renderForm()}
        </div>
      </div>
      <div className="row">
        <div className="col-xs-12 col-md-4 col-md-offset-4">
          {this.renderLocations()}
        </div>
      </div>
    </div>
  }
}

PreferencesView.propTypes = {
  showErrorMessage: PropTypes.func.isRequired,
  clearErrorMessage: PropTypes.func.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  addLocation: PropTypes.func.isRequired,
  removeLocation: PropTypes.func.isRequired
}

export const PreferencesViewWithHeader = withHeader(PreferencesView)
