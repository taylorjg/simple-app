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

  renderLocations() {
    return this.state.locations.map(location =>
      <Location
        key={location.id}
        location={location}
        onDelete={this.onDelete.bind(this)}
      />
    )
  }

  render() {
    return <div className="preferences">

      <div className="row">
        <div className="row-margins">
          <form className="form-inline">
            <div className="form-group form-group-sm">
              <label htmlFor="search">Search for a city:</label>
              <Autocomplete
                inputProps={{ id: 'search', className: 'preferences__search-input' }}
                value={this.state.searchValue}
                items={this.state.matches}
                getItemValue={match => match.location}
                onSelect={(searchValue, selectedMatch) => {
                  this.setState({
                    searchValue,
                    selectedMatch
                  })
                }}
                onChange={async (_, searchValue) => {
                  const matches = await search(searchValue)
                  this.setState({
                    searchValue,
                    matches
                  })
                }}
                renderItem={match => <div key={match.id}>{match.location}</div>}
              />
            </div>
            <button type="submit" className="btn btn-xs btn-primary"
              disabled={!this.state.selectedMatch}
              onClick={this.onAdd.bind(this)}>Add</button>
          </form>
        </div>
      </div>

      <div className="row">
        <div className="row-margins">
          {this.renderLocations()}
        </div>
      </div>

      <div className="row">
        <div className="row-margins">
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
