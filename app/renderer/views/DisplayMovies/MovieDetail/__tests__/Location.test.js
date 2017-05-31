'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Location from '../Location'

describe('location', () => {
  test('renders non clickable location when file does not exist', () => {
    const component = renderer.create(
      <Location location={'/path/to/file'} fileExists={false} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    // snapshot captures file icon, danger icon, and location text
  })

  test('renders clickable location when file exists', () => {
    const handleClick = jest.fn()

    const component = renderer.create(
      <Location
        location={'/path/to/file'}
        handleClick={handleClick}
        fileExists
      />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    // snapshot captures file icon, location, and click handler

    tree.props.onClick() // simulate a click
    expect(handleClick).toHaveBeenCalled()
  })
})
