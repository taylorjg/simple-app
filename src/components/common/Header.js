import React from 'react'
import { NavigationLinks } from './NavigationLinks'
import './Header.css'

export const Header = () => {
  return (
    <div className="row">
      <div className="row-margins">
        <NavigationLinks />
      </div>
    </div>
  )
}
