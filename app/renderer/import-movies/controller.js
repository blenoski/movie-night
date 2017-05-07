import { connect } from 'react-redux'
import ImportMovies from './ImportMovies'

// Wire up state changes to component props.
export const stateKey = 'importMovies'
function mapStateToProps (state) {
  return {
    searchDir: state[stateKey].searchDir,
    isCrawling: state[stateKey].isCrawling
  }
}

// Wire up the container.
export default connect(mapStateToProps)(ImportMovies)
