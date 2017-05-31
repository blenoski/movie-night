'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import ListMeta from '../ListMeta'

describe('ListMeta', () => {
  test('renders metadata', () => {
    const component = renderer.create(
      <ListMeta
        actors={['Ben Stiller', 'Tom Hanks', 'Jessica Alba']}
        director={'Todd Phillips'}
        genres={['action', 'comedy', 'drama']}
      />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    // snapshot captures display of actors, director, and genres
  })
})
