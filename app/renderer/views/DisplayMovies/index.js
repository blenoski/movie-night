import React, { Component } from 'react'
import styled from 'styled-components'
import MovieDetail from './MovieDetail'
import MovieGallery from './MovieGallery'
import { fadeIn, fadeOut } from '../styleUtils'

export default class DisplayMovies extends Component {
  constructor (props) {
    super(props)
    this.state = { width: 0, closing: false, prevFeaturedMovie: null }

    this.fadeOutAnimationEnded = this.fadeOutAnimationEnded.bind(this)
    this.selectCategory = this.selectCategory.bind(this)
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this)
  }

  // React Lifecycle Method.
  // Based on current props and incoming props, decide if we can
  // fade out the currently displayed movie details component.
  componentWillReceiveProps (nextProps) {
    // Handle cases when we should never animate.
    const curr = this.props.featuredMovie
    if (!curr.movie) { return } // nothing to fade out

    if (nextProps.searchCategory !== this.props.searchCategory) {
      return // do not animate when the search category changes
    }

    // Handle case when there is a new incoming featured movie
    const next = nextProps.featuredMovie
    if (next.movie) {
      if (next.action === 'search' ||
          next.movie.imdbID === curr.movie.imdbID ||
          (next.panelID >= 0 && next.panelID !== curr.panelID)) {
        return
      }
    }

    // Handle case where there is no incoming featured movie
    if (!next.movie) {
      if (curr.action === 'search' && nextProps.movies.length === 0) {
        return
      }
    }

    // If we get here, then animate.
    this.setState({ closing: true, prevFeaturedMovie: this.props.featuredMovie })
  }

  componentDidMount () {
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWindowDimensions)
  }

  fadeOutAnimationEnded (e) {
    e.preventDefault()
    this.setState({ closing: false, prevFeaturedMovie: null })
  }

  updateWindowDimensions () {
    this.setState({ width: window.innerWidth })
  }

  selectCategory (category) {
    const { updateSearchCategory } = this.props
    if (updateSearchCategory) {
      updateSearchCategory(category)
    }
  }

  render () {
    const { featuredMovie, movies, clearSearchQuery } = this.props

    // Handle no search results
    if (movies.length === 0) {
      return <NoMovieStyles>No Matches</NoMovieStyles>
    }

    // Special handling for featured movie from search result
    const { closing, prevFeaturedMovie } = this.state
    if (featuredMovie && featuredMovie.action === 'search') {
      const onClose = () => clearSearchQuery()
      return this.renderMovieDetails(onClose)
    } else if (closing && prevFeaturedMovie && prevFeaturedMovie.action === 'search') {
      return this.renderMovieDetails() // fade out search result
    }

    // If we only have one genre, then split it out over multiple
    // fixed length movie gallery rows. I.e. create one vertical scroll
    // browser instead of a single horizontal scroll browser.
    if (movies.length === 1) {
      const genre = movies[0].genre
      const allMovies = movies[0].movies

      const imagesPerPartition = Math.floor(this.state.width / 153) || 1
      const grid = this.gridPartition(allMovies, imagesPerPartition)
      let finalMovies = grid.map((movieList, index) => {
        return index === 0
          ? { genre, movies: movieList }
          : { movies: movieList }
      })

      return (
        <MoviesGroupedByGenre>
          {
            finalMovies.map((item, index) => {
              return this.renderGallery(item, index, 'grid')
            })
          }
        </MoviesGroupedByGenre>
      )
    }

    // Render the movie galleries.
    return (
      <MoviesGroupedByGenre>
        { movies.map((item, index) => this.renderGallery(item, index)) }
      </MoviesGroupedByGenre>
    )
  }

  renderGallery (item, index, renderStyle = 'row') {
    const { genre, movies } = item
    const { featuredMovie, clearFeaturedMovie } = this.props
    const { prevFeaturedMovie } = this.state
    const match = prevFeaturedMovie
      ? prevFeaturedMovie.panelID
      : featuredMovie.panelID

    return (
      <div key={index}>
        <MovieGallery
          key={index}
          genre={genre}
          movies={movies}
          id={index}
          renderStyle={renderStyle}
          handleSelectGenre={this.selectCategory}
        />
        { index === match && this.renderMovieDetails(clearFeaturedMovie) }
      </div>
    )
  }

  renderMovieDetails (onClose) {
    const { closing, prevFeaturedMovie } = this.state
    if (closing) {
      return (
        <FadeOut
          key={`out-${prevFeaturedMovie.imdbID}`}
          onAnimationEnd={this.fadeOutAnimationEnded}
        >
          <MovieDetail movie={prevFeaturedMovie.movie} />
        </FadeOut>
      )
    }

    const { featuredMovie } = this.props
    const movie = featuredMovie.movie
    if (!movie) {
      return null
    }

    return (
      <FadeIn key={movie.imdbID}>
        <MovieDetail
          movie={movie}
          handleCloseMovieDetails={onClose}
          center={featuredMovie.action === 'click'}
        />
      </FadeIn>
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

const FadeIn = styled.div`
  animation: 0.5s ${fadeIn} ease-in;
`

const FadeOut = styled.div`
  animation: 0.3s ${fadeOut} ease-out;
`
const NoMovieStyles = styled.div`
  align-items: center;
  background-color: rgba(20, 20, 20, 1);
  bottom: 0;
  color: rgba(2, 117, 216, 1);
  display: flex;
  flex-direction: column;
  font-size: 3rem;
  font-family: CopperPlate, serif;
  justify-content: center;
  left: 0;
  padding-bottom: 20%;
  position: fixed;
  right: 0;
  top: 50px;
`
