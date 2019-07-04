import { createReducer } from 'typesafe-actions'
import produce from 'immer'
import initialState from '../state'
import actions from '../actions'

const togglesReducer = createReducer(initialState)
  .handleAction(actions.toggleContent, (state, { payload: { entryId } }) =>
    produce(state, draft => {
      const prevVisibility = draft.contentVisibilityDict[entryId]
      draft.contentVisibilityDict[entryId] = !prevVisibility
    })
  ).handleAction(actions.toggleFocus, (state, { payload: { entryId } }) => {
    return produce(state, draft => {
      draft.isFocused = !draft.isFocused
    })
  })


export default togglesReducer
