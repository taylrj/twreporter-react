'use strict'
import _ from 'lodash'
import classNames from 'classnames'
import FitwidthMixin from '../mixins/FitwidthMixin'
import { getScreenType } from '../../lib/screen-type'
import BlockAlignmentWrapper from './BlockAlignmentWrapper'
import React, { Component } from 'react'
import LazyLoad from 'react-lazy-load'
import styles from './Image.scss'
import UI_SETTING from '../../constants/ui-settings'

const DEFAULT_WIDTH = 200
const DEFAULT_HEIGHT = 200

class Image extends FitwidthMixin(Component) {
  constructor(props) {
    super(props)

    this.state = {
      isMounted: false,
      screenType: 'MOBILE',
      width: DEFAULT_WIDTH,
      placeholderOpacity: 0,
      imageOpacity: 0
    }

    this.fitToParentWidth = this.fitToParentWidth.bind(this)
  }

  componentDidMount() {
    this.setState({
      isMounted: true,
      screenType: getScreenType(window.innerWidth)
    })

    if (super.componentDidMount) super.componentDidMount()
  }

  _renderPlaceHoderImage(imageUrl, imgStyle) {
    if (imageUrl) {
      return (
        <LazyLoad offsetTop={UI_SETTING.image.loadingOffset.placeholder}
          onContentVisible={() => this.setState({ placeholderOpacity: 1 })}
          className={styles.imgPlaceholderOuter}
          style={ { ...imgStyle, opacity: this.state.placeholderOpacity } }>
          <img src={ imageUrl } className={classNames('center-block', styles.imgPlaceHolder)} style={imgStyle} />
        </LazyLoad>
      )
    }
    return null
  }

  _renderFigure(imageObj, imgStyle) {
    if (_.get(imageObj, 'url')) {
      return (
        <figure>
          <LazyLoad offsetTop={UI_SETTING.image.loadingOffset.image} onContentVisible={() => this.setState({ imageOpacity: 1 })}>
            <img src={ imageObj.url }
              style={ { ...imgStyle, opacity: this.state.imageOpacity } }
              className={classNames('center-block', styles.imgAbsolute)}
            />
          </LazyLoad>
          { imageObj.description ? <figcaption className="image-caption" style={{ paddingTop: '1rem' }}>{ imageObj.description }</figcaption> : null}
        </figure>
      )
    }
    return null
  }

  _getNoscript(imgUrl, imgDes) {
    // generate image tag for search engines
    return {
      __html: '<img src="'+imgUrl+'" alt="'+imgDes+'">'
    }
  }

  _renderByDevice(screenType, imageByDevice, imgStyle) {
    switch(screenType) {
      case 'MOBILE':
        return this._renderFigure(imageByDevice.mobile, imgStyle)
      case 'TABLET':
        return this._renderFigure(imageByDevice.tablet, imgStyle)
      case 'DESKTOP':
        return this._renderFigure(imageByDevice.desktop, imgStyle)
      default:
        return this._renderFigure(imageByDevice.mobile, imgStyle)
    }
  }

  render() {
    let imageByDevice = _.get(this.props, [ 'content', 0 ], {})
    let { desktop, tiny } = imageByDevice
    let { isMounted, screenType, width } = this.state
    let { outerWidth, outerHeight } = this.props
    let boxWidth = outerWidth || width
    let boxHeight = outerHeight || this._getHeight(boxWidth, desktop, DEFAULT_WIDTH, DEFAULT_HEIGHT)
    let renderedPlaceHoderImage = null
    let renderedFigure = null

    let outerStyle = {
      width: boxWidth,
      minHeight: boxHeight
    }
    let imgStyle = {
      ...outerStyle,
      height: boxHeight
    }

    // if the Image is being mounted, select image to render
    // according to the device of the client
    if (isMounted) {
      renderedPlaceHoderImage = this._renderPlaceHoderImage(_.get(tiny, [ 'url' ]), imgStyle)
      renderedFigure = this._renderByDevice(screenType, imageByDevice, imgStyle)
    }

    return (
      <div ref="imageBox" style={outerStyle} className={styles.imageBox}>
        {renderedPlaceHoderImage}
        {renderedFigure}
        <noscript dangerouslySetInnerHTML={this._getNoscript(_.get(desktop, 'url', ''), _.get(imageByDevice, 'description', ''))} />
      </div>
    )
  }
}

Image.propTypes = {
  content: React.PropTypes.array,
  customeStyles: React.PropTypes.array,
  outerHeight: React.PropTypes.number,
  outerWidth: React.PropTypes.number
}

Image.defaultProps = {
  content: [],
  customeStyles: [],
  outerHeight: 0,
  outerWidth: 0
}

const AlignedImage = BlockAlignmentWrapper(Image)

export { AlignedImage, Image }
