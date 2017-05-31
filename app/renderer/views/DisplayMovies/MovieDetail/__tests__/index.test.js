'use strict'
/* globals jest, describe, test, expect */

import React from 'react'
import renderer from 'react-test-renderer'

import { shellMock } from '../../../../../../__mocks__/electron'
import MovieDetail from '../index'

jest.mock('../../../../../shared/utils', () => {
  return {
    fileExists: () => Promise.resolve(true)
  }
})

const movie = {
  actors: ['Ben Stiller', 'Will Ferrell'],
  director: 'Todd Phillips',
  imgFile: '/path/to/img',
  fileInfo: [
    { location: '/path/to/movie' }
  ],
  genres: ['action', 'comedy', 'drama']
}

describe('Movie Details', () => {
  test('renders', () => {
    const handleClose = jest.fn()
    const component = renderer.create(
      <MovieDetail
        movie={movie}
        handleCloseMovieDetails={handleClose}
        center
      />
    )

    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()

    // Clicking on close button calls back handler
    const close = tree.children[2].children[0].children[0].children[1]
    close.props.onClick({ preventDefault: jest.fn() })
    expect(handleClose).toHaveBeenCalledWith(movie)

    // Clicking on file calls electron.shell openFileInViewer
    const location = tree.children[2].children[3]
    location.props.onClick({ preventDefault: jest.fn() })
    expect(shellMock).toHaveBeenLastCalledWith(movie.fileInfo[0].location)

    shellMock.mockClear()
    expect(shellMock).not.toHaveBeenCalled()

    // Clicking on play button calls electron.shell openItem
    const playButton = tree.children[1].children[0].children[0]
    playButton.props.onClick({ preventDefault: jest.fn() })
    expect(shellMock).toHaveBeenLastCalledWith(movie.fileInfo[0].location)
  })

  test('unmounts', () => {
    const component = renderer.create(
      <MovieDetail
        movie={movie}
      />
    )

    setTimeout(() => component.unmount(), 0)
  })
})
