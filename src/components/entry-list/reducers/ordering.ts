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
  .handleAction(actions.addItem, (state, { payload }) => {
    return {
      ...state,
      itemsDict: {...state.itemsDict, 'newId': {id: 'newId', headline: 'new', tags: []}},
      levels: [1, ...state.levels],
      ordering: ['newId', ...state.ordering]
    }
  })

export default orderingReducer
