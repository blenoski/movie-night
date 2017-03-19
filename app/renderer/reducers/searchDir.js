import { SEARCH_DIRECTORY } from '../actions/types'

export default function (state = '', action) {
  switch (action.type) {
    case SEARCH_DIRECTORY:
      return action.payload
    default:
      return state
  }
}
