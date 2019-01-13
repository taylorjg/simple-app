import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { Location } from './Location'
import { search } from '../../services/locations'
import Autocomplete from 'react-autocomplete'
import './PreferencesView.css'

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      locations: this.props.locations,
      searchValue: '',
      matches: [],
      selectedMatch: null
    }
  }

  componentDidCatch(error, info) {
    console.error(`[PreferencesView#componentDid] error: ${error}; info: ${info}`)
  }

  async onAutocompleteChange(_, searchValue) {
    console.log(`[PreferencesView#onAutocompleteChange] searchValue: ${searchValue}`)
    this.setState({ searchValue })
    const matches = await search(searchValue)
    this.setState({ matches })
  }

  onAutocompleteSelect(searchValue, selectedMatch) {
    console.log(`[PreferencesView#onAutocompleteSelect] searchValue: ${searchValue}; selectedMatch: ${JSON.stringify(selectedMatch)}`)
    if (selectedMatch.city && selectedMatch.country) {
      this.setState({
        searchValue,
        selectedMatch
      })
    }
  }

  onAdd(e) {
    e.preventDefault()
    console.log(`[PreferencesView#onAdd] selectedMatch: ${JSON.stringify(this.state.selectedMatch)}`)
    this.setState({
      locations: [...this.state.locations, this.state.selectedMatch],
      searchValue: '',
      matches: [],
      selectedMatch: null
    })
  }

  onDelete(id) {
    console.log(`[PreferencesView#onSave] id: ${id}`)
    this.setState({
      locations: R.reject(location => location.id === id, this.state.locations)
    })
  }

  onSave(/* e */) {
    console.log('[PreferencesView#onSave]')
    this.props.saveLocations(this.state.locations)
  }

  onCancel(/* e */) {
    console.log('[PreferencesView#onCancel]')
  }

  renderItem(match, isHighlighted) {
    const className = isHighlighted ? 'bg-primary' : ''
    return (
      <div key={match.id} className={className}>
        {match.location}
      </div>
    )
  }

  renderLocations() {
    return this.state.locations.map(location =>
      <Location
        key={location.id}
        location={location}
        onDelete={this.onDelete.bind(this)}
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
            onChange={this.onAutocompleteChange.bind(this)}
            onSelect={this.onAutocompleteSelect.bind(this)}
            renderItem={this.renderItem.bind(this)}
            menuStyle={menuStyle}
          />
        </div>
        <button type="submit" className="btn btn-xs btn-primary"
          disabled={!this.state.selectedMatch}
          onClick={this.onAdd.bind(this)}>Add</button>
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
          <div className="preferences__buttons">
            <Link to="/" className="btn btn-xs btn-primary"
              onClick={this.onSave.bind(this)}>Save</Link>
            <Link to="/" className="btn btn-xs btn-default"
              onClick={this.onCancel.bind(this)}>Cancel</Link>
          </div>
        </div>
      </div>
    </div>
  }
}

PreferencesView.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  saveLocations: PropTypes.func.isRequired
}
