'use strict'
/* globals jest, test, expect */

import mockRenderer from 'react-test-renderer'

jest.mock('react-dom', () => {
  return {
    render: (component, root) => {
      const render = mockRenderer.create(component)
      let tree = render.toJSON()
      expect(tree).toMatchSnapshot()
    }
  }
})

test('app renders without crashing', () => {
  require('./index')
})
