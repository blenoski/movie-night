import { combineReducers } from 'redux'
import searchDirReducer from './SearchDir'

const rootReducer = combineReducers({
  searchDir: searchDirReducer
})

export default rootReducer
