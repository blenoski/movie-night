import path from 'path'
import React, { Component } from 'react'

class ImportMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.renderMovies = this.renderMovies.bind(this)
    this.fetchMovieDataFor = this.fetchMovieDataFor.bind(this)
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
      const { name } = path.parse(movie)

      // Delete anything that looks like metadata encoded in the title.
      // E.g. [1998], (2009), (D), [Meta]
      let searchTitle = name.replace(/\(.*?\)/g, '') // remove all text in parens
        .replace(/\[.*?\]/g, '') // remove all text in brackets
        .trim()

      const metadata = this.fetchMovieDataFor(searchTitle)
      const title = metadata.Title || `No result for ${searchTitle}`
      const year = metadata.Year || '<<RELEASE YEAR>>'
      const plot = metadata.Plot || '<<PLOT>>'
      const genre = metadata.Genre || '<<GENRE>>'
      const rating = metadata.Ratings[0].Value || '<<RATING>>'
      const imgSrc = metadata.Poster || '...'

      return (
        <div style={{display: 'flex'}} key={title}>
          <img src={imgSrc} alt='movie poster' />
          <div className='card'>
            <div className='card-block'>
              <h4 className='card-title'>{title}</h4>
              <h6 className='card-subtitle mb-2 text-muted'>{year}</h6>
              <h6 className='card-subtitle mb-2 text-muted'>Genre: {genre}</h6>
              <h6 className='card-subtitle mb-2 text-muted'>Rating: {rating}</h6>
              <p className='card-text'>{plot}</p>
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

  /* global XMLHttpRequest */
  fetchMovieDataFor (movie) {
    const baseURL = 'http://www.omdbapi.com/?plot=full&t='
    var req = new XMLHttpRequest()
    req.open('GET', `${baseURL}${movie}`, false)
    req.send(null)
    const response = JSON.parse(req.responseText)
    console.log(response)
    return response
  }
}

export default ImportMovies
