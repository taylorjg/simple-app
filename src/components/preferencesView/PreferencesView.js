import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import * as R from 'ramda'
import { Location } from './Location'
import { getCountries } from '../../services/locations'
import './PreferencesView.css'

const CHOOSE_VALUE = '[CHOOSE]'

export class PreferencesView extends Component {

  constructor(props) {
    super(props)
    this.state = {
      locations: this.props.locations,
      countries: [],
      busy: false,
      selectedCountry: null,
      selectedCity: null
    }
  }

  async componentDidMount() {
    try {
      console.log('[PreferencesView#componentDidMount]')
      this.setState({ busy: true })
      const countries = await getCountries()
      this.setState({ countries })
    } catch (error) {
      console.error(`[PreferencesView#componentDidMount] ${error.message}`)
    } finally {
      this.setState({ busy: false })
    }
  }

  componentDidCatch(error, info) {
    console.error(`[PreferencesView#componentDid] error: ${error}; info: ${info}`)
  }

  onCountryChanged(e) {
    const country = e.target.value
    console.log(`[PreferencesView#onCountryChanged] country: ${country}`)
    this.setState({
      selectedCountry: country === CHOOSE_VALUE
        ? null
        : this.state.countries.find(element => element[0] === country)
    })
  }

  onCityChanged(e) {
    const id = Number(e.target.value)
    console.log(`[PreferencesView#onCityChanged] id: ${id}`)
    this.setState({
      selectedCity: id === CHOOSE_VALUE
        ? null
        : this.state.selectedCountry[1].find(element => element.id === id)
    })
  }

  onAdd(e) {
    e.preventDefault()
    console.log(`[PreferencesView#onAdd] selectedCity: ${JSON.stringify(this.state.selectedCity)}`)
    this.setState({
      locations: [...this.state.locations, this.state.selectedCity]
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
              <label htmlFor="selectCountry">Country</label>
              <select className="form-control" id="selectCountry"
                defaultValue={CHOOSE_VALUE} disabled={this.state.busy}
                onChange={this.onCountryChanged.bind(this)}>
                <option value={CHOOSE_VALUE}>Choose a country</option>
                {
                  this.state.countries.map(([country]) =>
                    <option key={country} value={country}>{country || '(blank)'}</option>)
                }
              </select>
            </div>
            <div className="form-group form-group-sm">
              <label htmlFor="selectCity">City</label>
              <select className="form-control" id="selectCity"
                defaultValue={CHOOSE_VALUE} disabled={this.state.busy || !this.state.selectedCountry}
                onChange={this.onCityChanged.bind(this)}>
                <option value={CHOOSE_VALUE}>Choose a city</option>
                {
                  this.state.selectedCountry && this.state.selectedCountry[1].map(location =>
                    <option key={location.id} value={location.id}>{location.city}</option>)
                }
              </select>
            </div>
            <button type="submit" className="btn btn-xs btn-primary"
              disabled={!this.state.selectedCity}
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
