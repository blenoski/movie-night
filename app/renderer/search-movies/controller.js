import { connect } from 'react-redux'
import SearchMovies from './SearchMovies'
import { updateSearchQuery } from './state'

// Wire up state changes and dispatch actions to component props.
export const stateKey = 'searchMovies'

function mapStateToProps (state) {
  return {
    searchQuery: state[stateKey].searchQuery
  }
}

function mapDispatchToProps (dispatch) {
  return {
    handleSearchQueryChange: (text) => dispatch(updateSearchQuery(text))
  }
}

// Wire up the container.
export default connect(mapStateToProps, mapDispatchToProps)(SearchMovies)
