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
      closing: false,
      scrollTo: true
    }
    this.showMovieDetails = this.showMovieDetails.bind(this)
    this.updateMovieDetails = this.updateMovieDetails.bind(this)
    this.closeMovieDetails = this.closeMovieDetails.bind(this)
    this.movieDetailsClosed = this.movieDetailsClosed.bind(this)
    this.selectGenre = this.selectGenre.bind(this)
  }

  showMovieDetails (movie) {
    this.setState({ movie, scrollTo: true })
  }

  updateMovieDetails (movie) {
    if (this.state.movie) {
      this.setState({ movie, scrollTo: false })
    }
  }

  closeMovieDetails () {
    this.setState({ closing: true })
  }

  movieDetailsClosed (e) {
    e.preventDefault()
    this.setState({ movie: null, closing: false })
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
        { this.renderMovieDetails() }
      </Gallery>
    )
  }

  renderTitle () {
    const { genre, singleCategory } = this.props
    if (!genre) {
      return null
    }

    if (singleCategory) {
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
    const { movies, singleCategory } = this.props

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

    if (singleCategory) {
      return <NoScrollContainer>{thumbnails}</NoScrollContainer>
    } else {
      return <HorizontalScrollContainer>{thumbnails}</HorizontalScrollContainer>
    }
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
          center={this.state.scrollTo}
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

const NoScrollContainer = styled.div`
  display: flex;
`
