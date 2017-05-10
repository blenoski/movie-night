import React, { Component } from 'react'
import { shell } from 'electron'
import '../App.css'

class DisplayMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onMouseDown = this.onMouseDown.bind(this)
    this.onMouseUp = this.onMouseUp.bind(this)
    this.onPlayMovie = this.onPlayMovie.bind(this)
    this.onShowMovie = this.onShowMovie.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    console.log('mouse-click')
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  onMouseDown (e) {
    // e.preventDefault()
    console.log('mouse-down')
  }

  onMouseUp (e) {
    e.preventDefault()
    console.log('mouse-up')
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

  onPlayMovie (movie) {
    console.log('play', movie)
    shell.openItem(movie) // open movie in default program
  }

  onShowMovie (movie) {
    console.log('show', movie)
    shell.showItemInFolder(movie) // open movie selected in finder
  }

  renderDetailsFor (movie, genre) {
    return (
      <div style={{display: 'flex'}}>
        <div
          style={{
            marginRight: '20px',
            width: '300px',
            height: '444px',
            background: `url(${movie.imgFile}) no-repeat center`,
            display: 'flex',
            flexShrink: '0',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <button
            type='button'
            className='play-button'
            onClick={(e) => { e.preventDefault(); this.onPlayMovie(movie.fileInfo[0].location) }}
          >
            <i className='fa fa-play fa-3x' />
          </button>
        </div>
        <div style={{color: 'rgba(255,255,255,0.7)', height: '444px', display: 'flex', flexDirection: 'column'}}>
          <div>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <h1 style={{color: 'rgba(255,255,255,1.0)'}}>
                {`${movie.title}`}
              </h1>
            </div>
            <h6>
              <span>{movie.year}</span>
              <span style={{border: '1px solid', borderRadius: '5px', margin: '0px 10px', padding: '1px 4px'}}>
                {movie.rated}
              </span>
              <span>{movie.runtime}</span>
            </h6>
            <div>
              <h6>
                <span>Audience: {this.renderStarRating(Number(movie.imdbRating) / 10.0)}</span>
                <span style={{marginLeft: '20px'}}>Critics: {this.renderStarRating(Number(movie.metascore) / 100.0)}</span>
              </h6>
            </div>
          </div>
          <div style={{marginTop: '10px', overflowY: 'auto'}}>
            <p>{movie.plot}</p>
          </div>
          <div style={{marginTop: '20px'}}>
            <h6 style={{textTransform: 'capitalize'}}>
              <span style={{color: 'rgba(255,255,255,0.9)'}}>Starring:</span> {movie.actors.join(', ')}
            </h6>
            <h6 style={{textTransform: 'capitalize'}}>
              <span style={{color: 'rgba(255,255,255,0.9)'}}>Director:</span> {movie.director}
            </h6>
            <h6 style={{textTransform: 'capitalize'}}>
              <span style={{color: 'rgba(255,255,255,0.9)'}}>Genres:</span> {movie.genres.join(', ')}
            </h6>
          </div>
          <div
            style={{display: 'flex', cursor: 'pointer', marginTop: '20px'}}
            onClick={(e) => { e.preventDefault(); this.onShowMovie(movie.fileInfo[0].location) }}
          >
            <span
              className='fa fa-file-video-o fa-lg'
              style={{color: 'rgba(255,255,255,0.9)', marginRight: '5px'}}
            />
            <h6>
              {movie.fileInfo[0].location}
            </h6>
          </div>
        </div>
      </div>
    )
  }

  renderStarRating (rating) {
    const getIcon = (starId, starRating) => {
      if (starRating >= starId) {
        return <i key={starId} className='fa fa-star' />
      } else if (starRating + 0.5 >= starId) {
        return <i key={starId} className='fa fa-star-half-o' />
      } else {
        return <i key={starId} className='fa fa-star-o' />
      }
    }

    return (
      [1, 2, 3, 4, 5].map(starId => getIcon(starId, rating * 5))
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
          margin: '5px 10px 5px 0px',
          backgroundColor: '#141414',
          color: '#999',
          display: 'inline-block',
          cursor: 'pointer'
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
      <div>
        <div key={genre} style={{marginTop: '30px', marginRight: '10px'}}>
          <h2>{genre}<i className='fa fa-chevron-right fa-fw' aria-hidden='true' /></h2>
          <div className='mscroll' style={{display: 'flex', overflowX: 'auto'}}>
            {movieItems}
          </div>
        </div>
        {this.renderDetailsFor(movies[0], genre)}
      </div>
    )
  }
}

export default DisplayMovies
