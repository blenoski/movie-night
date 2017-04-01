import React, { Component } from 'react'

class ImportMovies extends Component {
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
    return (
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
    )
  }
}

export default ImportMovies
