import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withHeader } from '../common/Header'
import * as log from 'loglevel'
import './ProfileView.css'

export class ProfileView extends Component {

  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentDidCatch(error, info) {
    log.error(`[ProfileView#componentDidCatch] error: ${error}; info: ${info}`)
  }

  render() {
    return <div>
      <div className="row">
        <div className="row-margins">
          <div style={{
            paddingTop: '100px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <i>Under construction</i>
          </div>
        </div>
      </div>
    </div>
  }
}

ProfileView.propTypes = {
  showErrorMessage: PropTypes.func.isRequired
}

export const ProfileViewWithHeader = withHeader(ProfileView)
