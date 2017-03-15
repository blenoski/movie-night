import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// Import the Bootstrap styles.
// This will make the bootstrap styling default.
// Importing uniminified version so we can let Webpack handle minimization.
import '../../bootstrap/bootstrap-4.0.0-alpha.6-dist/css/bootstrap.css'

// Render the App.
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
