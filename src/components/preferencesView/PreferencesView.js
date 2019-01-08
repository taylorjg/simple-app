import React, { Component } from 'react'
import PropTypes from 'prop-types'
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
    this.setState({
      locations: R.reject(location => location.id === id, this.state.locations)
    })
  }

  onSave() {
    this.props.saveLocations(this.state.locations)
    this.props.history.push('/')
  }

  onCancel() {
    this.props.history.push('/')
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
            <button className="btn btn-xs btn-primary"
              onClick={this.onSave.bind(this)}
            >Save</button>
            <button className="btn btn-xs btn-default"
              onClick={this.onCancel.bind(this)}
            >Cancel</button>
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
