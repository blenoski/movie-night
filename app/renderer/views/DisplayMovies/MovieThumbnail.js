import { shell } from 'electron'
import React, { Component } from 'react'
import styled from 'styled-components'
import PlayButton from './MovieDetail/PlayMovieButton'
import { Angle } from '../../icons'

export default class MovieThumbnail extends Component {
  constructor (props) {
    super(props)
    this.state = { hover: false }
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.openMovieInDefaultPlayer = this.openMovieInDefaultPlayer.bind(this)
    this.onShowMovieDetailsClick = this.onShowMovieDetailsClick.bind(this)
  }

  mouseEnter (e) {
    e.preventDefault()
    this.setState({ hover: true })
    const { movie, handleUpdateMovieDetails } = this.props
    if (handleUpdateMovieDetails) {
      handleUpdateMovieDetails(movie)
    }
  }

  mouseLeave (e) {
    e.preventDefault()
    this.setState({ hover: false })
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

  render () {
    const { imgFile, title } = this.props.movie
    return (
      <ImageContainer
        onMouseEnter={this.mouseEnter}
        onMouseLeave={this.mouseLeave}
      >
        <StyledImage
          src={imgFile}
          alt={title}
        />
        {this.renderHoverButtons()}
      </ImageContainer>
    )
  }

  renderHoverButtons () {
    if (!this.state.hover) {
      return null
    }

    return (
      <Hover>
        <PlayButton onClick={this.openMovieInDefaultPlayer} small />
        <ShowMovieDetailsArrow down onClick={this.onShowMovieDetailsClick} />
      </Hover>
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

const StyledImage = styled.img`
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

const ShowMovieDetailsArrow = styled(Angle)`
  color: rgba(255,255,255,0.9);
  cursor: pointer;
  position: absolute;
  bottom: 0px;
  font-size: 50px;
  margin-bottom: -5px;
  overflow: hidden;
  text-shadow: 0px 0px 1px #141414;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: rgba(2,117,216,1);
  }
`
