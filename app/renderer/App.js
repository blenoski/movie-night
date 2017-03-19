import React, { Component } from 'react'
import ImportMovies from './components/ImportMovies'
import SearchDirectory from './components/SearchDirectory'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Welcome to Confident Cruiser's Movie Night</h2>
        </div>
        <ImportMovies />
        <SearchDirectory />
      </div>
    )
  }
}

export default App
