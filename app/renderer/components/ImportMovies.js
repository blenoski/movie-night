import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import { SELECT_IMPORT_DIRECTORY } from '../../shared/Events'
import logger from '../mainWindowLogger'

// Find all movies recursively in the selected directory
//  Report which directory is being searched
// For each movie:
//  update progress
//  query TMDB for movie metadata
//  print metadata to console
class ImportMovies extends Component {
  constructor (props) {
    super(props)
    this.onClick = this.onClick.bind(this)
  }

  onClick (e) {
    e.preventDefault()
    ipcRenderer.send(SELECT_IMPORT_DIRECTORY)
    logger.info('Sent SELECT_IMPORT_DIRECTORY event')
  }

  render () {
    return (
      <div>
        <button
          type='button'
          className='btn btn-outline-primary btn-lg'
          onClick={this.onClick}
        >
          Import Movies
        </button>
      </div>
    )
  }
}

export default ImportMovies
