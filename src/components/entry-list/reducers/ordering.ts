import { createReducer } from 'typesafe-actions'
import produce from 'immer'

import initialState  from '../state';
import actions from '../actions'
import { insert, evolve, merge, omit, remove, assoc } from 'ramda';

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
    const id = payload.id
    return evolve({
      itemsDict: merge({ [id]: {...payload, id}}),
      levels: insert(payload.position, payload.level),
      ordering: insert(payload.position, id)
    }, state)
  })
  .handleAction(actions.deleteItems, (state, { payload }) => {
    const position = payload[0]
    const id = state.ordering[position]
    return evolve({
      itemsDict: omit([id]),
      levels: remove(position, 1),
      ordering: remove(position, 1),
    }, state)
  })

  .handleAction(actions.changeItems, (state, { payload }) => {
    const item = payload[0]
    return evolve({
      itemsDict: assoc(item.id, item),
    }, state)
  })

export default orderingReducer
