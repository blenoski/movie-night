import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import { logEnv } from '../shared/utils'
import { App } from './controller'
import { createReduxStore } from './model'
import logger from './mainWindowLogger'

logEnv(logger)

// Render the App.
ReactDOM.render(
  <Provider store={createReduxStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
)
