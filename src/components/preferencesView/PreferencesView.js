import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { Location } from './Location'
import './PreferencesView.css'

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      locations: this.props.locations
    }
  }

  componentDidCatch(error, info) {
    console.error(`[PreferencesView#componentDidCatch] error: ${error}; info: ${info}`)
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
