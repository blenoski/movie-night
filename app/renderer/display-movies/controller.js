import { connect } from 'react-redux'
import DisplayMovies from './DisplayMovies'

export const stateKey = 'displayMovies'

// Wire up state changes to component props.
function mapStateToProps (state) {
  let filteredMovies = state[stateKey].movies
  let { searchQuery } = state['searchMovies']
  if (searchQuery) {
    // WARNING:
    // Tight inner loop executing in real time as user is typing search query.
    // Performance really matters inside this block.
    searchQuery = searchQuery.toLowerCase()

    filteredMovies = filteredMovies.filter((movie) => {
      if (movie.title.toLowerCase().indexOf(searchQuery) >= 0) {
        return true
      }

      // Look for matching genre. Use traditional for loop for performance.
      const genres = movie.genres
      const genresLength = genres.length
      for (let i = 0; i < genresLength; i += 1) {
        if (genres[i].indexOf(searchQuery) >= 0) {
          return true
        }
      }

      // Look for matching actor. Use traditional for loop for performance.
      const actors = movie.actors
      let actorsLength = actors.length
      for (let j = 0; j < actorsLength; j += 1) {
        if (actors[j].indexOf(searchQuery) >= 0) {
          return true
        }
      }

      return false
    })
  }

  return {
    movies: filteredMovies
  }
}

// Wire up the container.
export default connect(mapStateToProps)(DisplayMovies)
