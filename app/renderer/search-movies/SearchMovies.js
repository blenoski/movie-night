import React, { Component } from 'react'

class SearchMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
    this.onChange = this.onChange.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    if (this.props.onClick) {
      this.props.onClick()
    }
  }

  onChange (e) {
    e.preventDefault()
    if (this.props.onChange) {
      this.props.onChange(e.target.value)
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
          >
            Search Movies
          </button>
          <input
            type='text'
            className='form-control input-lg'
            value={this.props.searchTerm}
            onChange={this.onChange}
          />
        </div>
      </div>
    )
  }
}

export default SearchMovies
