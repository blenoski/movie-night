// Logic for mapping application state onto component props.
import { DisplayMoviesContainer, ImportMovies, SearchMovies, MainContent } from './containers'

// Logic for mapping application events directly to redux dispatch actions.
import './mapEventsToDispatch'

// Re-export all the containers.
export {
  DisplayMoviesContainer,
  ImportMovies,
  MainContent,
  SearchMovies
}
