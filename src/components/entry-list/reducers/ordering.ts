import { createReducer } from 'typesafe-actions'
import produce from 'immer'

import initialState  from '../state';
import actions from '../actions'

const orderingReducer = createReducer(initialState)
  .handleAction(actions.setEntriesOrdering, (state, { payload }) => {
    return {
      ...state,
      ordering: payload
    }
  })
  .handleAction(actions.setEntriesLevels, (state, { payload }) => {
    return {
      ...state,
      levels: payload
    }
  })

export default orderingReducer
