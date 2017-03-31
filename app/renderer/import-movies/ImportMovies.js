import React, { Component } from 'react'
import { ipcRenderer } from 'electron'
import { SELECT_IMPORT_DIRECTORY } from '../../shared/events'
import logger from '../mainWindowLogger'

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
