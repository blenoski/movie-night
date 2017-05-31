'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import Meta from '../Meta'

describe('Meta', () => {
  test('renders without error on missing props', () => {
    const component = renderer.create(
      <Meta />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('renders with metadata from props', () => {
    const component = renderer.create(
      <Meta rated={'R'} runtime={'125'} year={'2010'} />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    const year = tree.children[0]
    expect(year).toBe('2010')

    const rating = tree.children[1]
    expect(rating.children[0]).toBe('R')

    const runtime = tree.children[2]
    expect(runtime).toBe('125')
  })
})
