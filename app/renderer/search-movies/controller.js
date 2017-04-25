import { connect } from 'react-redux'
import SearchMovies from './SearchMovies'

// Wire up state changes to component props.
export const stateKey = 'searchMovies'
function mapStateToProps (state) {
  return {
    searchTerm: state[stateKey].searchTerm
  }
}

// Wire up the container.
export default connect(mapStateToProps)(SearchMovies)
