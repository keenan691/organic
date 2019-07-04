import { createReducer } from 'typesafe-actions'
import produce from 'immer'

import initialState  from '../state';
import actions from '../actions'

const commandsReducer = createReducer(initialState)
  .handleAction(actions.runCommand, (state, { payload }) => state)

export default commandsReducer
