import React, { Component } from 'react'

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

    const genres = ['Comedy', 'Drama', 'Action']

    return (
      <div>
        { genres.map(genre => this.renderMovieByGenre(genre)) }
      </div>
    )
  }

  renderMovieByGenre (genre) {
    const movies = this.props.movies.filter((movie) => {
      const firstGenre = movie.genre.split(',')[0]
      return firstGenre.toLowerCase().indexOf(genre.toLowerCase()) >= 0
    })

    const movieItems = movies.map((movie) => {
      return (
        <div key={movie.imdbID} style={{padding: '10px 0px', margin: '0px 5px'}}>
          <img src={movie.imgFile} alt='movie poster' width='150px' height='222px' />
        </div>
      )
    })

    return (
      <div>
        <h2 style={{color: 'white', margin: '10px 0 0 10px'}}>{genre.toUpperCase()}</h2>
        <div key={genre} style={{display: 'flex', overflow: 'scroll'}}>
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
