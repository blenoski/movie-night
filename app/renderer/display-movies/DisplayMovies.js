import React, { Component } from 'react'

class DisplayMovies extends Component {
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
    if (this.props.movies.length <= 0) {
      return null
    }

    // Create a histogram of title counts for each genre.
    const genreMap = new Map()
    this.props.movies.forEach((movie) => {
      const genre = movie.genres[0] // get first genre
      const count = genreMap.get(genre) || 0
      genreMap.set(genre, count + 1)
    })

    // Sort genres in order from most titles to least titles.
    const genres = [ ...genreMap ].sort((genreLhs, genreRhs) => {
      return genreRhs[1] - genreLhs[1]
    }).map((genre) => {
      return genre[0]
    })

    return (
      <div style={{marginTop: '60px', paddingLeft: '20px'}}>
        { genres.map(genre => this.renderMovieByGenre(genre)) }
      </div>
    )
  }

  renderMovieByGenre (genre) {
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

    const movieItems = movies.map((movie) => {
      return (
        <div className='movie' key={movie.imdbID} style={{
          margin: '5px 0px 5px 0px',
          backgroundColor: '#141414',
          color: '#999',
          transitionProperty: 'all',
          transitionDuration: '500ms',
          transitionTimingFunction: 'linear',
          display: 'inline-block',
          cursor: 'pointer',
          paddingRight: '10px'
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
      <div style={{marginTop: '30px'}}>
        <h2>{genre}<i className='fa fa-chevron-right fa-fw' aria-hidden='true' /></h2>
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

export default DisplayMovies
