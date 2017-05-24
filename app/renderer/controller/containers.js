import { ipcRenderer } from 'electron'
import { connect } from 'react-redux'

import { SELECT_IMPORT_DIRECTORY } from '../../shared/events'
import { updateSearchQuery } from '../model'
import Button from '../views/Button'
import DisplayMovies from '../views/DisplayMovies'
import MainContentArea from '../views/MainContent'
import logger from '../mainWindowLogger'
import SearchBar from '../views/SearchBar'

// This function maps a button click handler to an application event.
function importMovies () {
  ipcRenderer.send(SELECT_IMPORT_DIRECTORY)
  logger.info('Sent SELECT_IMPORT_DIRECTORY event')
}

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
function mapStateToSearchBarProps (state) {
  return {
    searchQuery: state.searchQuery
  }
}

function mapDispatchToSearchBarProps (dispatch) {
  return {
    handleQueryChange: (text) => dispatch(updateSearchQuery(text))
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
    updateSearchQuery: (text) => dispatch(updateSearchQuery(text))
  }
}

export const DisplayMoviesContainer = connect(
  mapStateToDisplayMoviesProps,
  mapDispatchToDisplayMoviesProps
)(DisplayMovies)

// MainContent Container
// ---------------------
function mapStateToMainContentProps (state) {
  const { dbLoaded, filteredMovies, isCrawling, movies } = state
  return {
    dbLoaded,
    movies,
    filteredMovies,
    isCrawling,
    handleAddMediaClick: importMovies
  }
}

export const MainContent = connect(mapStateToMainContentProps)(MainContentArea)
