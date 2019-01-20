import { connect } from 'react-redux'
import {
  clearFeaturedMovie, // Redux action creators
  clearSearchResults,
  clearSearchQuery,
  updateSearchQuery,
  updateSearchCategory,
  updateFeaturedMovie,
  getAllMovies, // State selectors
  getCrawlActive,
  getFeaturedMovie,
  getSearchCategory,
  getSearchQuery,
  getVisibleMovies,
  importMovies, // Electron action creators
  updateMetadataFor
} from '../model'

// Presentational Components
import Application from '../views/App'
import Button from '../views/Button'
import DisplayMovies from '../views/DisplayMovies'
import MainContentArea from '../views/MainContent'
import MovieThumbnail from '../views/DisplayMovies/MovieThumbnail'
import SearchBar from '../views/SearchBar'

// App Container
// -------------
export function mapStateToAppProps ({ dbLoaded }) {
  return {
    dbLoaded
  }
}

export const App = connect(mapStateToAppProps)(Application)

// ImportMovies Container
// ----------------------
export function mapStateToImportMoviesProps (state) {
  return {
    busy: getCrawlActive(state),
    handleClick: importMovies
  }
}

export const ImportMovies = connect(
  mapStateToImportMoviesProps
)(Button)

// SearchMovies Container
// ----------------------
export function mapStateToSearchBarProps (state) {
  return {
    searchCategory: getSearchCategory(state),
    searchQuery: getSearchQuery(state)
  }
}

export function mapDispatchToSearchBarProps (dispatch) {
  return {
    handleQueryChange: (text) => dispatch(updateSearchQuery(text)),
    handleClear: () => {
      dispatch(clearSearchResults())
    }
  }
}

export const SearchMovies = connect(
  mapStateToSearchBarProps,
  mapDispatchToSearchBarProps
)(SearchBar)

// MovieThumbnail Container
// -----------------------
export function mapDispatchToMovieThumbnailProps (dispatch) {
  return {
    handleMovieSelected: ({ movie, action, panelID }) => {
      if (action === 'click') {
        dispatch(updateFeaturedMovie({ movie, action, panelID }))
      }
    }
  }
}

export const MovieThumbnailContainer = connect(
  null,
  mapDispatchToMovieThumbnailProps
)(MovieThumbnail)

// DisplayMovies Container
// -----------------------
export function mapStateToDisplayMoviesProps (state) {
  return {
    featuredMovie: getFeaturedMovie(state),
    movies: getVisibleMovies(state),
    searchCategory: getSearchCategory(state),
    searchQuery: getSearchQuery(state)
  }
}

export function mapDispatchToDisplayMoviesProps (dispatch) {
  return {
    clearFeaturedMovie: () => dispatch(clearFeaturedMovie()),
    clearSearchQuery: () => dispatch(clearSearchQuery()),
    updateSearchCategory: (category) => dispatch(updateSearchCategory(category)),
    updateMovieMetadata: (movie) => updateMetadataFor(movie)
  }
}

export const DisplayMoviesContainer = connect(
  mapStateToDisplayMoviesProps,
  mapDispatchToDisplayMoviesProps
)(DisplayMovies)

// MainContent Container
// ---------------------
export function mapStateToMainContentProps (state) {
  return {
    isCrawling: getCrawlActive(state),
    handleAddMediaClick: importMovies,
    totalMovieCount: getAllMovies(state).length
  }
}

export const MainContent = connect(mapStateToMainContentProps)(MainContentArea)
