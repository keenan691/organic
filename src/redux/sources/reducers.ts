import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'

// prettier-ignore
const initialState: InitialState = {
}

// prettier-ignore
const reducers = createReducer(initialState)
  .handleAction(actions.addSource, (state, { payload }) => state)

export default reducers
