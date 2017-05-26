import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'

import { SELECT_IMPORT_DIRECTORY } from '../../shared/events'
import { updateSearchQuery, updateSearchCategory } from '../model'
import Application from '../views/App'
import Button from '../views/Button'
import DisplayMovies from '../views/DisplayMovies'
import MainContentArea from '../views/MainContent'
import SearchBar from '../views/SearchBar'
import logger from '../mainWindowLogger'

// This function maps a button click handler to an application event.
function importMovies () {
  ipcRenderer.send(SELECT_IMPORT_DIRECTORY)
  logger.info('Sent SELECT_IMPORT_DIRECTORY event')
}

// App Container
// -------------
function mapStateToAppProps ({ dbLoaded }) {
  return {
    dbLoaded
  }
}

export const App = connect(mapStateToAppProps)(Application)

// ImportMovies Container
// ----------------------
export const ImportMovies = connect(({ isCrawling }) => {
  return {
    busy: isCrawling,
    handleClick: importMovies
  }
})(Button)

// SearchMovies Container
// ----------------------
function mapStateToSearchBarProps ({searchCategory, searchQuery}) {
  return {
    searchCategory,
    searchQuery
  }
}

function mapDispatchToSearchBarProps (dispatch) {
  return {
    handleQueryChange: (text) => dispatch(updateSearchQuery(text)),
    handleClear: () => {
      dispatch(updateSearchQuery(''))
      dispatch(updateSearchCategory(''))
    }
  }
}

export const SearchMovies = connect(
  mapStateToSearchBarProps,
  mapDispatchToSearchBarProps
)(SearchBar)

// DisplayMovies Container
// -----------------------
function mapStateToDisplayMoviesProps (state) {
  return {
    searchQuery: state.searchQuery,
    movies: state.filteredMovies
  }
}

function mapDispatchToDisplayMoviesProps (dispatch) {
  return {
    updateSearchQuery: (text) => dispatch(updateSearchQuery(text)),
    updateSearchCategory: (category) => dispatch(updateSearchCategory(category))
  }
}

export const DisplayMoviesContainer = connect(
  mapStateToDisplayMoviesProps,
  mapDispatchToDisplayMoviesProps
)(DisplayMovies)

// MainContent Container
// ---------------------
function mapStateToMainContentProps (state) {
  const { filteredMovies, isCrawling, movies } = state
  return {
    movies,
    filteredMovies,
    isCrawling,
    handleAddMediaClick: importMovies
  }
}

export const MainContent = connect(mapStateToMainContentProps)(MainContentArea)
