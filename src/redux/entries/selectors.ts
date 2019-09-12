import { InitialState } from './types'
import { createSelector } from 'reselect';

const getData = (state: InitialState) => state.data
const getEditorIds = (state: InitialState) => state.editorIds

const getEditorEntries = createSelector(getData, getEditorIds, (data, ids) => ({
  itemDict: data,
  levels: ids.map((id) => data[id].level),
  ordering: ids,
}))

// prettier-ignore
const selectors = {
  getEditorEntries,
}

export default selectors
