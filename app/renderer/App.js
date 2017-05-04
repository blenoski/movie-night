import React, { Component } from 'react'
import AppController from './AppController'
import ImportMovies from './import-movies'
import SearchMovies from './search-movies'

import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Confident Cruiser's Movie Night</h2>
        </div>
        <div>
          <SearchMovies />
        </div>
        <div>
          <ImportMovies
            onClick={AppController.importMovies}
            />
        </div>
      </div>
    )
  }
}

export default App
