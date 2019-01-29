import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withHeader } from '../common/Header'
import { Location } from './Location'
import { search } from '../../services/locations'
import { AsyncTypeahead } from 'react-bootstrap-typeahead'
import * as log from 'loglevel'
import './PreferencesView.css'

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      busy: false,
      cityMatches: [],
      selectedLocation: null
    }
  }

  componentDidCatch(error, info) {
    log.error(`[PreferencesView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  onCitySearch = async searchValue => {
    try {
      log.info(`[PreferencesView#onAutocompleteChange] searchValue: ${searchValue}`)
      this.setState({ busy: true, searchValue })
      const cityMatches = await search(searchValue)
      this.setState({ cityMatches })
      this.props.clearErrorMessage()
    } catch (error) {
      log.error(`[PreferencesView#onAutocompleteChange] ${error.message}`)
      this.setState({ cityMatches: [] })
      this.props.showErrorMessage(error.message)
    } finally {
      this.setState({ busy: false })
    }
  }

  onCityChange = selectedItems => {
    log.info(`[PreferencesView#onAutocompleteSelect] selectedItems: ${JSON.stringify(selectedItems)}`)
    const selectedLocation = selectedItems[0]
    this.setState({
      selectedLocation
    })
  }

  onAdd = e => {
    log.info(`[PreferencesView#onAdd] selectedLocation: ${JSON.stringify(this.state.selectedLocation)}`)
    e.preventDefault()
    this.setState({
      cityMatches: [],
      selectedLocation: null
    })
    this.cityTypeahead.getInstance().clear()
    const existingLocation =
      this.props.locations.find(location =>
        location.id === this.state.selectedLocation.id)
    if (existingLocation) {
      this.props.showErrorMessage(`Duplicate location, "${this.state.selectedLocation.location}".`)
      return
    }
    this.props.addLocation(this.state.selectedLocation)
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

    return (
      <form>
        <div className="form-group form-group-sm">
          <label htmlFor="search">Search for a city:</label>
          <AsyncTypeahead
            ref={cityTypeahead => this.cityTypeahead = cityTypeahead}
            bsSize="sm"
            isLoading={this.state.busy}
            onSearch={this.onCitySearch}
            onChange={this.onCityChange}
            filterBy={['city']}
            labelKey='location'
            options={this.state.cityMatches}
          />
        </div>
        <button type="submit" className="btn btn-xs btn-primary"
          disabled={!this.state.selectedLocation}
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
