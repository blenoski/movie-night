import { SEARCH_DIRECTORY } from './types'

export function updateSearchDirectory (directory) {
  return {
    type: SEARCH_DIRECTORY,
    payload: directory
  }
}
