import product from 'immer'
import { createReducer } from 'typesafe-actions'
import { InitialState } from './types'
import actions from './actions'

const initialState: InitialState = {
  isReady: false,
  isFirstRun: true,
  isPrivacyPolicyAgreed: false,
}

const reducer = createReducer(initialState)
  .handleAction(actions.startup.request, state => state)
  .handleAction(actions.startup.failure, state => state)
  .handleAction(actions.startup.success, state => ({...state, isReady: true}))

export default reducer
