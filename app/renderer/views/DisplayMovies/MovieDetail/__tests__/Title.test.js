'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Title from '../Title'

describe('Title', () => {
  test('handles missing title prop', () => {
    const component = renderer.create(
      <Title />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('h1')
    expect(tree.children).toBeNull()
  })

  test('renders title from prop', () => {
    const component = renderer.create(
      <Title title={'Top Gun'} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.type).toBe('h1')
    expect(tree.children[0]).toBe('Top Gun')
  })
})
