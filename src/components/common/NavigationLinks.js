import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import * as R from 'ramda'
import './NavigationLinks.css'

// TODO: resolve the duplication of paths with <Router> in App.js
const LINKS = [
  {
    path: '/',
    label: 'Home'
  },
  {
    path: '/preferences',
    label: 'Preferences'
  },
  {
    path: '/profile',
    label: 'Profile'
  }
]

class InternalNavigationLinks extends Component {

  renderLink(link) {
    return (
      this.props.match.url === link.path
        ? <span key={link.path}>{link.label}</span>
        : <Link key={link.path} to={link.path}>{link.label}</Link>
    )
  }

  renderSeparator() {
    return (
      <span className="navigation-links__separator">|</span>
    )
  }

  render() {
    return (
      <div className="navigation-links">
        {
          R.pipe(
            R.map((link) => this.renderLink(link)),
            // TODO: figure out how to add a key prop to each separator
            R.intersperse(this.renderSeparator())
          )(LINKS)
        }
      </div>
    )
  }
}

export const NavigationLinks = withRouter(InternalNavigationLinks)
