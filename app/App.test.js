import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

/* globals test  */
test('App renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})
