'use strict'
/* globals describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import PlayButton from '../PlayMovieButton'

describe('PlayButton', () => {
  test('renders normal size play button', () => {
    const component = renderer.create(
      <PlayButton />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.children[0].props.className).toContain('fa-play')
  })

  test('renders small play button when small prop passed', () => {
    const component = renderer.create(
      <PlayButton small />
    )
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
    expect(tree.children[0].props.className).toContain('fa-play')
  })

  test('calls handleClick callback on onClick event', (done) => {
    const handleClick = () => {
      done()
    }

    const component = renderer.create(
      <PlayButton handleClick={handleClick} />
    )

    let tree = component.toJSON()
    tree.props.onClick()
  })
})
