import React from 'react'
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

const InternalNavigationLinks = ({ match }) => {

  const getPath = link =>
    Array.isArray(link.path)
      ? link.path[0]
      : link.path

  const isActive = link =>
    Array.isArray(link.path)
      ? link.path.includes(match.url)
      : link.path === match.url

  const renderLink = (link, index) =>
    isActive(link)
      ? <span key={index}>{link.label}</span>
      : <Link key={index} to={getPath(link)}>{link.label}</Link>

  const renderSeparator = index =>
    <span key={index} className="navigation-links__separator">|</span>

  const renderItem = (item, index) =>
    item ? renderLink(item, index) : renderSeparator(index)

  return (
    <div className="navigation-links">
      {R.intersperse(null, LINKS).map(renderItem)}
    </div>
  )
}

export const NavigationLinks = withRouter(InternalNavigationLinks)
