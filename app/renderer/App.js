import React, { Component } from 'react'
import ImportMovies from './import-movies'
import './App.css'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Welcome to Confident Cruiser's Movie Night</h2>
        </div>
        <ImportMovies />
      </div>
    )
  }
}

export default App
