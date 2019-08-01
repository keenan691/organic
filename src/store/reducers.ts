import { combineReducers } from 'redux'
import {
  reducers as startupReducers,
  REDUX_SLICE_NAME as STARTUP_REDUX_SLICE_NAME,
} from 'modules/startup'
import { reducers as filesReducers, REDUX_SLICE_NAME as FILES_SLICE_NAME } from 'modules/files'
import { reducers as entriesReducers, REDUX_SLICE_NAME as ENTRIES_SLICE_NAME } from 'modules/entries'

export default combineReducers({
  [ENTRIES_SLICE_NAME]: entriesReducers,
  [FILES_SLICE_NAME]: filesReducers,
  [STARTUP_REDUX_SLICE_NAME]: startupReducers,
})
