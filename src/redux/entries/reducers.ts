import product from 'immer'
import {createReducer} from 'typesafe-actions'
import {InitialState} from './types'
import actions from './actions'
import {indexBy, prop, omit} from 'ramda'

const initialState: InitialState = {
  status: 'ready',
  editorEntryPoint: null,
  agendaIds: [],
  editorIds: [],
  searchIds: [],
  data: {},
}

const reducers = createReducer(initialState)
  .handleAction(actions.loadEntriesForEntryPoint.request, (state, {payload}) => {
      return ({
          ...state,
          status: 'loading',
          editorEntryPoint: payload,
        data: omit(state.editorIds, state.data),
        editorIds: []
      });
  })
  .handleAction(actions.loadEntriesForEntryPoint.failure, state => state)
  .handleAction(actions.loadEntriesForEntryPoint.success, state => {
    return {...state, status: 'loading'}
  })
  .handleAction(actions.mergeAgendaEntries, (state, {payload}) => state)
  .handleAction(actions.mergeEditorEntries, (state, {payload}) => {
    const entriesDict = indexBy(prop('id'), payload)
    const editorIds = payload.map(prop('id'))
    return {
      ...state,
      data: {...state.data, ...entriesDict},
      editorIds,
    }
  })
  .handleAction(actions.mergeSearchEntries, (state, {payload}) => state)

export default reducers
