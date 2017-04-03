import path from 'path'
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

    const movieItems = this.props.movies.map((movie, index) => {
      const { name } = path.parse(movie)
      return <li key={index}>{name}</li>
    })

    return (
      <div>
        <h2 style={{padding: '10px'}}>Movies</h2>
        <ul>{movieItems}</ul>
      </div>
    )
  }
}

export default ImportMovies
