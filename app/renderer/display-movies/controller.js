import { connect } from 'react-redux'
import DisplayMovies from './DisplayMovies'

// Wire up state changes to component props.
export const stateKey = 'displayMovies'
function mapStateToProps (state) {
  let filteredMovies = state[stateKey].movies
  const { searchQuery } = state['searchMovies']
  if (searchQuery) {
    filteredMovies = filteredMovies.filter((movie) => {
      return (
        movie.title.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0 ||
        movie.genre.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
      )
    })
  }

  return {
    movies: filteredMovies
  }
}

// Wire up the container.
export default connect(mapStateToProps)(DisplayMovies)
