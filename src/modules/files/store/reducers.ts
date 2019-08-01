import product from 'immer'
import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'

const initialState: InitialState = {
  files: {},
  currentImportTaskDescription: null,
}

const reducer = createReducer(initialState)
  .handleAction(actions.createFileFromSource.request, (state, { payload }) => ({
    ...state,
    currentImportTaskDescription: payload,
  }))
  .handleAction(actions.createFileFromSource.cancel, state => state)
  .handleAction(actions.createFileFromSource.failure, state => state)
  .handleAction(actions.createFileFromSource.success, (state, { payload: plainFile }) => ({
    ...state,
    currentImportTaskDescription: null,
    files: { ...state.files, [plainFile.id]: plainFile },
  }))

export default reducer
