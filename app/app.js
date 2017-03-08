import React, { Component } from 'react'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <div className='App-header'>
          <h2>Welcome to Confident Cruiser's Electron+React Starter Package</h2>
        </div>
        <p className='App-intro'>
          This boilerplate includes:
        </p>
        <ul>
          <li>React</li>
          <li>Electon</li>
          <li>Babel for transcompiling</li>
          <li>Webpack for bundling and live reload dev support</li>
          <li>Jest for testing</li>
          <li>Standard for code style and linting</li>
        </ul>
      </div>
    )
  }
}

export default App
