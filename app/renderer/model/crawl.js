'use strict'
import {
  CRAWL_DIRECTORY,
  IS_CRAWLING
} from './actionTypes'

const initialState = { directory: '', active: false }

export default (state = initialState, action) => {
  switch (action.type) {
    case CRAWL_DIRECTORY: {
      return {
        active: true,
        directory: action.payload
      }
    }

    case IS_CRAWLING: {
      return {
        ...state,
        active: action.payload
      }
    }

    default:
      return state
  }
}

export const active = (state) => state.active
export const directory = (state) => state.directory
