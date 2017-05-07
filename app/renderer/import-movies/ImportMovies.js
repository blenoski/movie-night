import React, { Component } from 'react'
import '../App.css'

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
      <button
        type='button'
        className='btn btn-outline-primary'
        onClick={this.onClick}
        disabled={this.props.isCrawling}
      >
        <i className='fa fa-database' />
      </button>
    )
  }
}

export default ImportMovies

/*
<input
  type='text'
  className='form-control input'
  value={this.props.searchDir}
/>
*/
