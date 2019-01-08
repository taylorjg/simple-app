import React, { Component } from 'react'
import ContentLoader from 'react-content-loader'

export class WeatherInfoLoader extends Component {
  render() {
    return (
      <div className="weather-info" ref={element => this.element = element}>
        <ContentLoader
          width={this.element ? this.element.offsetWidth : 0}
          height={this.element ? this.element.offsetWidth * 0.7755 : 0}
          speed={2}
          primaryColor="#f3f3f3"
          secondaryColor="#ecebeb"
          {...this.props}
        >
          {/* Weather in location */}
          <rect x="5" y="20" rx="5" ry="5" width="240" height="22" />

          {/* Make this rect a cloud shape! */}
          <rect x="8" y="70" rx="5" ry="5" width="45" height="25" />
          <rect x="65" y="70" rx="5" ry="5" width="40" height="25" />
          <rect x="120" y="75" rx="5" ry="5" width="120" height="20" />

          {/* Description */}
          <rect x="5" y="125" rx="5" ry="5" width="125" height="22" />

          {/* Humidity */}
          <rect x="5" y="160" rx="5" ry="5" width="100" height="18" />

          {/* Pressure */}
          <rect x="5" y="180" rx="5" ry="5" width="130" height="18" />

          {/* Wind speed */}
          <rect x="5" y="200" rx="5" ry="5" width="133" height="18" />
        </ContentLoader>
      </div>
    )
  }
}
