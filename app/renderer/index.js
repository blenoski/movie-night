import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { logEnv } from '../shared/utils'
import App from './App'
import store from './AppState'
import logger from './mainWindowLogger'

logEnv(logger)

// Render the App.
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
