'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Ratings from '../Ratings'

describe('Ratings', () => {
  test('renders ratings', () => {
    const component = renderer.create(
      <Ratings audience={0.6} critics={0.3} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const audienceRating = tree.children[0]
    expect(audienceRating.children[0]).toContain('Audience')

    const criticsRating = tree.children[1]
    expect(criticsRating.children[0]).toContain('Critics')
  })
})
