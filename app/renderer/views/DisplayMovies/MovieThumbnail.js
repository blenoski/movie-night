import { shell } from 'electron'
import React, { Component } from 'react'
import styled from 'styled-components'
import { fileExists } from '../../../shared/utils'
import { Angle } from '../../icons'
import { fadeIn, fadeOut } from '../styleUtils'
import PlayButton from './MovieDetail/PlayMovieButton'

export default class MovieThumbnail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      controls: 'hide', // hide, fadingIn, fadingOut, show
      image: 'show', // show, fadeOut
      fileAvailable: true
    }

    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.onAnimationEnd = this.onAnimationEnd.bind(this)

    this.openMovieInDefaultPlayer = this.openMovieInDefaultPlayer.bind(this)
    this.onShowMovieDetailsClick = this.onShowMovieDetailsClick.bind(this)
    this.onUpdateMovieDetails = this.onUpdateMovieDetails.bind(this)
    this.renderControls = this.renderControls.bind(this)
  }

  mouseEnter (e) {
    e.preventDefault()
    this.setState({ controls: 'fadingIn' })
    fileExists(this.props.movie.fileInfo[0].location)
      .then(result => this.setState({ fileAvailable: result }))
  }

  mouseLeave (e) {
    e.preventDefault()
    if (this.state.controls === 'show') {
      this.setState({ controls: 'fadingOut' })
    } else {
      this.setState({ controls: 'hide' })
    }
  }

  onAnimationEnd (e) {
    e.preventDefault()
    if (this.state.controls === 'fadingIn') {
      this.setState({ controls: 'show' })
    } else if (this.state.controls === 'fadingOut') {
      this.setState({ controls: 'hide' })
    }
  }

  openMovieInDefaultPlayer (e) {
    e.preventDefault()
    const { location } = this.props.movie.fileInfo[0]
    shell.openItem(location)
  }

  onShowMovieDetailsClick (e) {
    e.preventDefault()
    const { movie, handleShowMovieDetails } = this.props
    if (handleShowMovieDetails) {
      handleShowMovieDetails(movie)
    }
  }

  onUpdateMovieDetails (e) {
    e.preventDefault()
    const { movie, handleUpdateMovieDetails } = this.props
    if (handleUpdateMovieDetails) {
      handleUpdateMovieDetails(movie)
    }
  }

  render () {
    return (
      <ImageContainer
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        {this.renderImage()}
        {this.renderControls()}
      </ImageContainer>
    )
  }

  renderImage () {
    const { imgFile, title } = this.props.movie

    return <Image
      src={imgFile}
      alt={title}
    />
  }

  renderControls () {
    if (this.state.controls === 'hide') {
      return null
    }

    const Tag = this.state.controls === 'fadingOut' ? HoverOut : HoverIn

    return (
      <Tag onAnimationEnd={this.onAnimationEnd} >
        {this.state.fileAvailable && <PlayButton onClick={this.openMovieInDefaultPlayer} small />}
        <ShowMovieDetailsArrow
          down
          onClick={this.onShowMovieDetailsClick}
          onMouseEnter={this.onUpdateMovieDetails}
        />
      </Tag>
    )
  }
}

const ImageContainer = styled.div`
  margin: 5px 10px 5px 0px;
  backgroundColor: #141414;
  color: #999;
  display: flex;
  position: relative;
`

const Image = styled.img`
  width: 150px;
  height: 222px;
`

const Hover = styled.div`
  position: absolute;
  top: 0px;
  left: 0px
  right: 0px;
  bottom: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const HoverIn = styled(Hover)`
  animation: 0.5s ${fadeIn} ease-in;
`

const HoverOut = styled(Hover)`
  animation: 0.3s ${fadeOut} ease-out;
`

const ShowMovieDetailsArrow = styled(Angle)`
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  position: absolute;
  bottom: 0px;
  font-size: 50px;
  margin-bottom: -5px;
  overflow: hidden;
  text-align: center;
  text-shadow: 0px 0px 1px #141414;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: rgba(2,117,216,1);
  }
`
