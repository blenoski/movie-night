import { connect } from 'react-redux'
import ImportMovies from './ImportMovies'

// Wire up state changes to component props.
export const stateKey = 'importMovies'
function mapStateToProps (state) {
  const { searchTerm } = state['searchMovies']
  let movies = state[stateKey].movies.filter((movie) => {
    return movie.title.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0
  })

  return {
    searchDir: state[stateKey].searchDir,
    isCrawling: state[stateKey].isCrawling,
    movies
  }
}

// Wire up the container.
export default connect(mapStateToProps)(ImportMovies)
