import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

// Import the Bootstrap styles.
// This will make the bootstrap styling default.
// Importing unminified version so we can let Webpack handle minimization.
import 'bootstrap/dist/css/bootstrap.css'

// Render the App.
ReactDOM.render(
  <App />,
  document.getElementById('root')
)
