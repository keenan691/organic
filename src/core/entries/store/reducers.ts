import product from 'immer'
import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'

// prettier-ignore
const initialState: InitialState = {
  objects: {},
  orderingByFile: {}
}

const reducer = createReducer(initialState)
  .handleAction(actions.loadEntries.request, state => state)
  .handleAction(actions.loadEntries.cancel, state => state)
  .handleAction(actions.loadEntries.failure, state => state)
  .handleAction(actions.loadEntries.success, (state, { payload }) => {
      return state;
  })

  .handleAction(actions.preloadEntries.request, state => state)
  .handleAction(actions.preloadEntries.cancel, state => state)
  .handleAction(actions.preloadEntries.failure, state => state)
  .handleAction(actions.preloadEntries.success, (state, { payload }) => payload)

export default reducer
