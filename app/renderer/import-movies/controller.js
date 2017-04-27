import { connect } from 'react-redux'
import ImportMovies from './ImportMovies'

// Wire up state changes to component props.
export const stateKey = 'importMovies'
function mapStateToProps (state) {
  const { searchCategory, searchQuery } = state['searchMovies']
  let filteredMovies = state[stateKey].movies
  if (searchQuery) {
    if (!searchCategory) { // match ALL categories
      filteredMovies = filteredMovies.filter((movie) => {
        return (
          movie.title.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0 ||
          movie.genre.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
        )
      })
    } else if (searchCategory === 'Title') {
      filteredMovies = filteredMovies.filter((movie) => {
        return movie.title.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
      })
    } else if (searchCategory === 'Genre') {
      filteredMovies = filteredMovies.filter((movie) => {
        return movie.genre.toLowerCase().indexOf(searchQuery.toLowerCase()) >= 0
      })
    }
  }

  return {
    searchDir: state[stateKey].searchDir,
    isCrawling: state[stateKey].isCrawling,
    movies: filteredMovies
  }
}

// Wire up the container.
export default connect(mapStateToProps)(ImportMovies)
