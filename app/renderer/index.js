import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { logEnv } from '../shared/utils'
import App from './App'
import store from './AppState'
import logger from './mainWindowLogger'

// Import the Bootstrap styles.
// This will make the bootstrap styling default.
// Importing unminified version so we can let Webpack handle minimization.
import 'bootstrap/dist/css/bootstrap.css'

logEnv(logger)

// Render the App.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
