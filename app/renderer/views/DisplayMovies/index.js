import React, { Component } from 'react'
import styled from 'styled-components'
import MovieDetail from './MovieDetail'
import MovieGallery from './MovieGallery'

export default class DisplayMovies extends Component {
  constructor (props) {
    super(props)
    this.state = { width: 0 }
    this.onClick = this.onClick.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
  }

  componentDidMount () {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  updateWindowDimensions () {
    this.setState({ width: window.innerWidth })
  }

  onClick (e) {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  selectCategory (category) {
    const { updateSearchCategory } = this.props
    if (updateSearchCategory) {
      updateSearchCategory(category)
    }
  }

  render () {
    const { movies, updateSearchQuery, searchQuery } = this.props

    if (movies.length === 0) {
      return null
    }

    // Special handling when we only have one genre.
    let finalMovies = movies
    if (movies.length === 1) {
      const genre = movies[0].genre
      const allMovies = movies[0].movies

      // If there is only one search result, then go
      // ahead and display the details for that result.
      if (allMovies.length === 1 && searchQuery) {
        const onlyMovie = allMovies[0]
        return (
          <MovieDetail
            movie={onlyMovie}
            handleCloseMovieDetails={() => updateSearchQuery('')}
          />
        )
      } else {
        // If we only have one genre, then split it out over multiple
        // fixed length movie gallery rows. I.e. create one vertical scroll
        // browser instead of multiple horizontal scroll browsers.
        const imagesPerPartition = Math.floor(this.state.width / 153) || 1
        const grid = this.gridPartition(allMovies, imagesPerPartition)
        finalMovies = grid.map((movieList, index) => {
          return index === 0
            ? { genre, movies: movieList }
            : { movies: movieList }
        })

        const singleCategory = true
        return (
          <MoviesGroupedByGenre>
            {
              finalMovies.map((item, index) => {
                return this.renderGallery(item, index, singleCategory)
              })
            }
          </MoviesGroupedByGenre>
        )
      }
    }

    // Render the movie galleries.
    return (
      <MoviesGroupedByGenre>
        { finalMovies.map((item, index) => this.renderGallery(item, index)) }
      </MoviesGroupedByGenre>
    )
  }

  renderGallery (item, key, singleCategory = false) {
    const { genre, movies } = item
    return (
      <div key={key}>
        <MovieGallery
          key={key}
          genre={genre}
          movies={movies}
          singleCategory={singleCategory}
          handleSelectGenre={this.selectCategory}
        />
      </div>
    )
  }

  gridPartition (items, size) {
    const grid = items.reduce((result, item) => {
      const index = result.length - 1
      if (result[index].length < size) {
        result[index].push(item)
      } else {
        result.push([item])
      }
      return result
    }, [ [] ])

    return grid
  }
}

const MoviesGroupedByGenre = styled.div`
  padding-left: 20px;
`
