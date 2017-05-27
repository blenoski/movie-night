// Logic for mapping application state onto component props.
import {
  App,
  DisplayMoviesContainer,
  ImportMovies,
  SearchMovies,
  MainContent,
  MovieThumbnailContainer
} from './containers'

// Logic for mapping application events directly to redux dispatch actions.
import './mapEventsToDispatch'

// Re-export all the containers.
export {
  App,
  DisplayMoviesContainer,
  ImportMovies,
  MainContent,
  MovieThumbnailContainer,
  SearchMovies
}
