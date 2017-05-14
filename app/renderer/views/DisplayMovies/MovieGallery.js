import React, { Component } from 'react'
import styled from 'styled-components'
import { Chevron } from '../../icons'
import MovieDetail from './MovieDetail'
import MovieThumbnail from './MovieThumbnail'

import { fadeIn, fadeOut } from '../styleUtils'

export default class MovieGallery extends Component {
  constructor (props) {
    super(props)
    this.state = {
      movie: null,
      closing: false
    }
    this.showMovieDetails = this.showMovieDetails.bind(this)
    this.updateMovieDetails = this.updateMovieDetails.bind(this)
    this.closeMovieDetails = this.closeMovieDetails.bind(this)
    this.movieDetailsClosed = this.movieDetailsClosed.bind(this)
  }

  showMovieDetails (movie) {
    this.setState({ movie })
  }

  updateMovieDetails (movie) {
    if (this.state.movie) {
      this.setState({ movie })
    }
  }

  closeMovieDetails () {
    this.setState({ closing: true })
  }

  movieDetailsClosed (e) {
    e.preventDefault()
    this.setState({ movie: null, closing: false })
  }

  render () {
    const { genre, movies } = this.props

    const thumbnails = movies.map((movie) => {
      return (
        <FadeIn key={movie.imdbID}>
          <MovieThumbnail
            key={movie.imdbID}
            movie={movie}
            handleShowMovieDetails={this.showMovieDetails}
            handleUpdateMovieDetails={this.updateMovieDetails}
          />
        </FadeIn>
      )
    })

    return (
      <Gallery key={genre}>
        <Title>{genre}<Chevron right fixedWidth /></Title>
        <HorizontalScrollContainer>{thumbnails}</HorizontalScrollContainer>
        {this.renderMovieDetails()}
      </Gallery>
    )
  }

  renderMovieDetails () {
    const { movie, closing } = this.state
    if (!movie) {
      return null
    }

    if (closing) {
      return (
        <FadeOut
          key={`out-${movie.imdbID}`}
          onAnimationEnd={this.movieDetailsClosed}
        >
          <MovieDetail movie={movie} />
        </FadeOut>
      )
    }

    return (
      <FadeIn key={movie.imdbID}>
        <MovieDetail
          movie={movie}
          handleCloseMovieDetails={this.closeMovieDetails}
        />
      </FadeIn>
    )
  }
}

const FadeIn = styled.div`
  animation: 0.5s ${fadeIn} ease-in;
`

const FadeOut = styled.div`
  animation: 0.3s ${fadeOut} ease-out;
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
