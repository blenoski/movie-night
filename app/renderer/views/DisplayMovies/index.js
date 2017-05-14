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

  rankedGenres () {
    // Create a histogram of title counts for each genre.
    const genreMap = new Map()
    this.props.movies.forEach((movie) => {
      const genre = movie.genres[0] // get first genre
      const count = genreMap.get(genre) || 0
      genreMap.set(genre, count + 1)
    })

    // Sort genres in order from most titles to least titles.
    const genres = [ ...genreMap ].sort((lhs, rhs) => {
      const countRhs = rhs[1]
      const countLhs = lhs[1]
      return countRhs - countLhs
    }).map((genre) => {
      return genre[0]
    })

    return genres
  }

  render () {
    const { movies, closeMovieDetailsWhenOnlyOneMovie } = this.props

    if (movies.length <= 0) {
      return null
    }

    if (movies.length === 1) {
      return (
        <MovieDetail
          movie={movies[0]}
          handleCloseMovieDetails={closeMovieDetailsWhenOnlyOneMovie}
        />
      )
    }

    return (
      <MoviesGroupedByGenre>
        { this.rankedGenres().map(genre => this.renderMovieByGenre(genre)) }
      </MoviesGroupedByGenre>
    )
  }

  renderMovieByGenre (genre) {
    // Grab the movies in this genre.
    // Sort any movies with no poster to the end.
    const movies = this.props.movies.filter((movie) => {
      return movie.genres[0] === genre
    })
    .sort((movieLhs, movieRhs) => {
      if (movieLhs.imgFile && !movieRhs.imgFile) {
        return -1
      } else if (movieRhs.imgFile && !movieLhs.imgFile) {
        return 1
      } else {
        return 0
      }
    })

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
