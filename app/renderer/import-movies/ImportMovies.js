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
        <div style={{display: 'flex'}}>
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

    const movieItems = this.props.movies.map((movie) => {
      return (
        <div style={{display: 'flex'}} key={movie.imdbID || movie.title}>
          <img src={movie.imgFile} alt='movie poster' />
          <div className='card'>
            <div className='card-block'>
              <h4 className='card-title'>{movie.title}</h4>
              <h6 className='card-subtitle mb-2 text-muted'>{movie.year}</h6>
              <h6 className='card-subtitle mb-2 text-muted'>Genre: {movie.genre}</h6>
              <h6 className='card-subtitle mb-2 text-muted'>Rating: {movie.rating}</h6>
              <h6 className='card-subtitle mb-2 text-muted'>Location: {movie.location[0]}</h6>
              <p className='card-text'>{movie.plot}</p>
            </div>
          </div>
        </div>
      )
    })

    return (
      <div>
        <h2 style={{padding: '10px'}}>Movies</h2>
        {movieItems}
      </div>
    )
  }
}

export default ImportMovies
