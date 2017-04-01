import React, { Component } from 'react'
import AppController from './AppController'
import ImportMovies from './import-movies'

import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Welcome to Confident Cruiser's Movie Night</h2>
        </div>
        <ImportMovies
          onClick={AppController.importMovies}
        />
      </div>
    )
  }
}

export default App
