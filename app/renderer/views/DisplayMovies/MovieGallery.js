import React, { Component } from 'react'
import styled from 'styled-components'
import { Chevron } from '../../icons'
import { MovieThumbnailContainer } from '../../controller'

import { fadeIn } from '../styleUtils'

export default class MovieGallery extends Component {
  constructor (props) {
    super(props)
    this.selectGenre = this.selectGenre.bind(this)
  }

  selectGenre (genre) {
    return (e) => {
      e.preventDefault()
      const { handleSelectGenre } = this.props
      if (handleSelectGenre) {
        handleSelectGenre(genre)
      }
    }
  }

  render () {
    const { genre } = this.props

    return (
      <Gallery key={genre}>
        { this.renderTitle() }
        { this.renderThumbnails() }
      </Gallery>
    )
  }

  renderTitle () {
    const { genre, renderStyle } = this.props
    if (!genre) {
      return null
    }

    if (renderStyle === 'grid') {
      return <Title>{genre}</Title>
    }

    return (
      <Title>
        <Genre onClick={this.selectGenre(genre)}>
          {genre}
          <Chevron right fixedWidth />
        </Genre>
      </Title>
    )
  }

  renderThumbnails () {
    const { movies, renderStyle, id } = this.props

    const thumbnails = movies.map((movie) => {
      return (
        <FadeIn key={movie.imdbID}>
          <MovieThumbnailContainer
            key={movie.imdbID}
            movie={movie}
            panelID={id}
            handleShowMovieDetails={this.showMovieDetails}
            handleUpdateMovieDetails={this.updateMovieDetails}
          />
        </FadeIn>
      )
    })

    if (renderStyle === 'grid') {
      return <GridContainer>{thumbnails}</GridContainer>
    } else {
      return <HorizontalScrollContainer>{thumbnails}</HorizontalScrollContainer>
    }
  }
}

const FadeIn = styled.div`
  animation: 0.5s ${fadeIn} ease-in;
`

const Gallery = styled.div`
  marginTop: 30px;
  marginRight: 10px;
`

const Title = styled.h2`
  line-height: 1.3;
  margin: 0;
  display: block;
  font-size: 1.2em;
  font-weight: bold;
  color: #999;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: transparent;
  text-transform: capitalize;
`

const Genre = styled.span`
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  &:hover {
    color: rgba(255,255,255,0.7);
  }
`

const HorizontalScrollContainer = styled.div`
  display: flex;
  overflowX: auto;
  &::-webkit-scrollbar {
      height: 12px;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-track {
      display: none;
  }

  &::-webkit-scrollbar-thumb {
    display: block;
    border-radius: 10px;
    background-color: rgba(255,255,255,0.1);
  }
`

const GridContainer = styled.div`
  display: flex;
`
