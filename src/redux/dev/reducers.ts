import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'

// prettier-ignore
const initialState: InitialState = {
  currentDevScreen: null,
}

// prettier-ignore
const reducers = createReducer(initialState)
  .handleAction(actions.selectDevScreen, (state, { payload }) => ({
    ...state,
    currentDevScreen: payload
  }))

export default reducers
