import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ContentLoader from 'react-content-loader'
import log from 'loglevel'
import * as R from 'ramda'

const MAX_DEPTH = 2

export const withLoader = WrappedComponent => {

  return class Loader extends Component {

    constructor(props) {
      log.info(`[Loader#constructor]`)
      super(props)
      this.div = null
      this.componentDiv = null
      this.svg = null
      this.resizeObserver = new ResizeObserver(this.onResize)
      this.state = {
        loaderWidth: 0,
        loaderHeight: 0,
        rects: []
      }
    }

    componentDidUpdate(prevProps) {
      log.info(`[Loader#componentDidUpdate]`)
      if (this.props.isLoading && !prevProps.isLoading) {
        this.reset()
      }
    }

    componentWillUnmount() {
      log.info(`[Loader#componentWillUnmount]`)
      this.reset()
    }

    reset() {
      log.info(`[Loader#reset]`)
      this.componentDiv && this.resizeObserver.unobserve(this.componentDiv)
      this.div = null
      this.componentDiv = null
      this.svg = null
      this.setState({
        loaderWidth: 0,
        loaderHeight: 0,
        rects: []
      })
    }

    getChildRects(el, level) {
      const maxDepth = this.props.maxDepth || MAX_DEPTH
      const children = Array.from(el.children)
      const rectss = children.map((child, index) => {
        if (child.children.length && level < maxDepth) {
          return this.getChildRects(child, level + 1)
        } else {
          const x = child.offsetLeft
          const y = child.offsetTop
          const width = child.offsetWidth
          const height = child.offsetHeight
          const key = `${level}-${index}-${x}-${y}`
          const rect = <rect key={key} x={x} y={y} width={width} height={height} />
          return [rect]
        }
      })
      return R.flatten(rectss)
    }

    onResize = () => {
      log.info(`[Loader#onResize]`)

      this.componentDiv.style.visibility = 'hidden'

      const computedStyle = getComputedStyle(this.componentDiv)
      const depxify = s => s.endsWith('px') ? s.slice(0, -2) : s
      const marginTop = depxify(computedStyle.getPropertyValue('margin-top'))
      const borderTopWidth = depxify(computedStyle.getPropertyValue('border-top-width'))
      const paddingTop = depxify(computedStyle.getPropertyValue('padding-top'))
      const marginLeft = depxify(computedStyle.getPropertyValue('margin-left'))
      const borderLeftWidth = depxify(computedStyle.getPropertyValue('border-left-width'))
      const paddingLeft = depxify(computedStyle.getPropertyValue('padding-left'))

      this.svg.style.top = 0 - marginTop - borderTopWidth - paddingTop
      this.svg.style.left = 0 - marginLeft - borderLeftWidth - paddingLeft

      this.svg.style.margin = computedStyle.getPropertyValue('margin')
      this.svg.style.border = computedStyle.getPropertyValue('border')
      this.svg.style.padding = computedStyle.getPropertyValue('padding')

      const rects = this.getChildRects(this.componentDiv, 0)

      this.setState({
        loaderWidth: this.componentDiv.offsetWidth,
        loaderHeight: this.componentDiv.offsetHeight,
        rects
      })
    }

    setDiv(div) {
      log.info(`[Loader#setDiv] div: ${div}`)
      if (div && !this.div) {
        this.div = div
        this.componentDiv = div.children[0]
        this.svg = div.children[1]
        this.resizeObserver.observe(this.componentDiv)
      }
    }

    renderLoading(otherProps) {
      return (
        <div ref={div => this.setDiv(div)} style={{ position: 'relative' }}>
          <WrappedComponent {...otherProps} />
          <ContentLoader
            width={this.state.loaderWidth}
            height={this.state.loaderHeight}
            style={{ position: 'absolute' }}
          >
            {this.state.rects}
          </ContentLoader>
        </div>
      )
    }

    renderLoaded(otherProps) {
      return (
        <WrappedComponent {...otherProps} />
      )
    }

    render() {
      const { isLoading, ...otherProps } = this.props
      return isLoading
        ? this.renderLoading(otherProps)
        : this.renderLoaded(otherProps)
    }
  }
}

withLoader.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  maxDepth: PropTypes.number
}
