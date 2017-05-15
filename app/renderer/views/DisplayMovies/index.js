import React, { Component } from 'react'
import styled from 'styled-components'
import MovieDetail from './MovieDetail'
import MovieGallery from './MovieGallery'

export default class DisplayMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render () {
    const { movies, closeMovieDetailsWhenOnlyOneMovie } = this.props

    if (movies.length === 0) {
      return null
    }

    if (movies.length === 1) {
      const moviesFirstGenre = movies[0].movies
      if (moviesFirstGenre.length === 1) {
        return (
          <MovieDetail
            movie={moviesFirstGenre[0]}
            handleCloseMovieDetails={closeMovieDetailsWhenOnlyOneMovie}
          />
        )
      }
    }

    return (
      <MoviesGroupedByGenre>
        { movies.map(item => this.renderMovies(item)) }
      </MoviesGroupedByGenre>
    )
  }

  renderMovies (item) {
    const { genre, movies } = item
    return (
      <div key={genre}>
        <MovieGallery key={genre} genre={genre} movies={movies} />
      </div>
    )
  }
}

const MoviesGroupedByGenre = styled.div`
  padding-left: 20px;
`
