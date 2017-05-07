import React, { Component } from 'react'
import '../App.css'

class ImportMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.renderMovies = this.renderMovies.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  render () {
    return (
      <div>
        <div style={{display: 'flex', width: '100%'}}>
          <button
            type='button'
            className='btn btn-outline-primary btn-lg'
            onClick={this.onClick}
            disabled={this.props.isCrawling}
          >
            Import Movies
          </button>
          <input
            type='text'
            className='form-control input-lg'
            value={this.props.searchDir}
          />
        </div>
        {this.renderMovies()}
      </div>
    )
  }

  renderMovies () {
    if (this.props.movies.length <= 0) {
      return
    }

    // Create a histogram of title counts for each genre.
    const genreMap = new Map()
    this.props.movies.forEach((movie) => {
      const genre = movie.genre.split(',')[0].toLowerCase() // get first genre
      let count = genreMap.get(genre) || 0
      genreMap.set(genre, count + 1)
    })

    // Sort genres in order from most titles to least titles.
    const genres = [ ...genreMap ].sort((genreLhs, genreRhs) => {
      return genreRhs[1] - genreLhs[1]
    }).map((genre) => {
      return genre[0]
    })

    return (
      <div>
        { genres.map(genre => this.renderMovieByGenre(genre)) }
      </div>
    )
  }

  renderMovieByGenre (genre) {
    const movies = this.props.movies.filter((movie) => {
      const firstGenre = movie.genre.split(',')[0].toLowerCase()
      return firstGenre.indexOf(genre.toLowerCase()) >= 0
    }).sort((movieLhs, movieRhs) => {
      if (movieLhs.imgFile && !movieRhs.imgFile) {
        return -1
      } else if (movieRhs.imgFile && !movieLhs.imgFile) {
        return 1
      } else {
        return 0
      }
    })

    const movieItems = movies.map((movie) => {
      return (
        <div className='movie' key={movie.imdbID} style={{
          margin: '5px 5px',
          backgroundColor: '#141414',
          color: '#999',
          transitionProperty: 'all',
          transitionDuration: '500ms',
          transitionTimingFunction: 'linear'
        }}>
          <img
            src={movie.imgFile}
            alt={movie.title}
            style={{
              width: '150px',
              height: '222px'
            }}
          />
        </div>
      )
    })

    return (
      <div style={{marginTop: '10px'}}>
        <h2>{genre}</h2>
        <div className='mscroll' key={genre} style={{display: 'flex', overflowX: 'auto'}}>
          {movieItems}
        </div>
      </div>
    )
  }
}

/*
const locations = movie.fileInfo.reduce((prev, info) => {
  return prev + ` ${info.location}`
}, 'Location:')
<div className='card'>
  <div className='card-block'>
    <h4 className='card-title'>{`${movie.title} (${index})`}</h4>
    <h6 className='card-subtitle mb-2 text-muted'>{movie.year}</h6>
    <h6 className='card-subtitle mb-2 text-muted'>Genre: {movie.genre}</h6>
    <h6 className='card-subtitle mb-2 text-muted'>Rating: {movie.rating}</h6>
    <h6 className='card-subtitle mb-2 text-muted'>{locations}</h6>
    <p className='card-text'>{movie.plot}</p>
  </div>
</div>
*/

export default ImportMovies
