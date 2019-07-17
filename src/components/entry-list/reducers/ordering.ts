import { createReducer } from 'typesafe-actions'
import produce from 'immer'

import initialState  from '../state';
import actions from '../actions'
import { insert, evolve, merge } from 'ramda';

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
    const id = 'newIdsdfsdf' + Math.random()
    return evolve({
      itemsDict: merge({ [id]: {...payload, id}}),
      levels: insert(payload.position, payload.level),
      ordering: insert(payload.position, id)
    }, state)
  })

export default orderingReducer
