import { combineReducers } from 'redux'
import {
  reducers as startupReducers,
  REDUX_SLICE_NAME as STARTUP_REDUX_SLICE_NAME,
} from 'redux/startup'
import { reducers as filesReducers, REDUX_SLICE_NAME as FILES_SLICE_NAME } from 'redux/files'
import { reducers as entriesReducers, REDUX_SLICE_NAME as ENTRIES_SLICE_NAME } from 'redux/entries'
import { reducers as devReducers, REDUX_SLICE_NAME as DEV_SLICE_NAME } from 'redux/dev'

export default combineReducers({
  [DEV_SLICE_NAME]: devReducers,
  [ENTRIES_SLICE_NAME]: entriesReducers,
  [FILES_SLICE_NAME]: filesReducers,
  [STARTUP_REDUX_SLICE_NAME]: startupReducers,
})
