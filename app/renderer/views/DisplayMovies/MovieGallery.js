import React, { Component } from 'react'
import styled from 'styled-components'
import { Chevron } from '../../icons'
import MovieDetail from './MovieDetail'
import MovieThumbnail from './MovieThumbnail'

export default class MovieGallery extends Component {
  constructor (props) {
    super(props)
    this.state = { detail: null }
    this.showMovieDetails = this.showMovieDetails.bind(this)
    this.updateMovieDetails = this.updateMovieDetails.bind(this)
    this.closeMovieDetails = this.closeMovieDetails.bind(this)
  }

  showMovieDetails (movie) {
    this.setState({ detail: movie })
  }

  updateMovieDetails (movie) {
    if (this.state.detail) {
      this.setState({ detail: movie })
    }
  }

  closeMovieDetails (movie) {
    this.setState({ detail: null })
  }

  render () {
    const { genre, movies } = this.props

    const thumbnails = movies.map((movie) => {
      return (
        <MovieThumbnail
          key={movie.imdbID}
          movie={movie}
          handleShowMovieDetails={this.showMovieDetails}
          handleUpdateMovieDetails={this.updateMovieDetails}
        />
      )
    })

    return (
      <Gallery key={genre}>
        <Title>{genre}<Chevron right fixedWidth /></Title>
        <HorizontalScrollContainer>{thumbnails}</HorizontalScrollContainer>
        {this.renderDetails()}
      </Gallery>
    )
  }

  renderDetails () {
    if (!this.state.detail) {
      return null
    }

    return (
      <MovieDetail
        movie={this.state.detail}
        handleCloseMovieDetails={this.closeMovieDetails}
      />
    )
  }
}

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
      height: 10px;
  }

  &::-webkit-scrollbar-button {
    display: none;
  }

  &::-webkit-scrollbar-track {
      display: none;
  }

  &::-webkit-scrollbar-track:hover {
    display: block;
    border-radius: 10px;
    box-shadow: inset 0 0 4px rgba(255,255,255,0.4);
  }

  &::-webkit-scrollbar-thumb {
      display: block;
      border-radius: 10px;
      box-shadow: inset 0 0 4px rgba(255,255,255,0.4);
  }
`
