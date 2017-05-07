import React, { Component } from 'react'
import AppController from './AppController'
import DisplayMovies from './display-movies'
import ImportMovies from './import-movies'
import Logo from './logo'
import SearchMovies from './search-movies'

import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <Logo />
          <div style={{display: 'flex'}}>
            <SearchMovies />
            <ImportMovies onClick={AppController.importMovies} />
          </div>
        </div>
        <DisplayMovies />
      </div>
    )
  }
}

export default App
