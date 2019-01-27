import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import * as R from 'ramda'
import './NavigationLinks.css'

// TODO: resolve the duplication of paths with <Router> in App.js
const LINKS = [
  {
    path: ['/', '/index.html'],
    label: 'Home'
  },
  {
    path: '/preferences',
    label: 'Preferences'
  }
]

class InternalNavigationLinks extends Component {

  getPath(link) {
    return Array.isArray(link.path)
      ? link.path[0]
      : link.path
  }

  isActive(link) {
    return Array.isArray(link.path)
      ? link.path.includes(this.props.match.url)
      : link.path === this.props.match.url
  }

  renderLink(link, index) {
    return (
      this.isActive(link)
        ? <span key={index}>{link.label}</span>
        : <Link key={index} to={this.getPath(link)}>{link.label}</Link>
    )
  }

  renderSeparator(index) {
    return (
      <span key={index} className="navigation-links__separator">|</span>
    )
  }

  renderItem(item, index) {
    return item
      ? this.renderLink(item, index)
      : this.renderSeparator(index)
  }

  render() {
    return (
      <div className="navigation-links">
        {
          R.intersperse(null, LINKS)
            .map((item, index) => this.renderItem(item, index))
        }
      </div>
    )
  }
}

export const NavigationLinks = withRouter(InternalNavigationLinks)
