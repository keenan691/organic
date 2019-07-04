import { createReducer, Action } from 'typesafe-actions'
import produce from 'immer'

import actions from '../actions'
import initialState from '../state'
import reducer from '.'
import { cond, allPass } from 'ramda'
import selectors from '../selectors'
import { safeGet } from 'helpers/functions'

// TODO create helper for creating cutom reducer which casts entryId and dispatch  object argumants of callback
// TODO create action creators for actions with meta and interactive property
// TODO update generators
const interactionsReducer = createReducer(initialState)
  .handleAction(actions.onItemPress, (state, { payload: { entryId } }) => {
    const isFocused = safeGet('id', selectors.getFocusedEntry(state)) === entryId

    // TODO Create curried reducer
    const reduceActions = <A extends Action>(actions: A[]) =>
      actions.reduce((prevState, action: A) => reducer(prevState, action), state)
    // reducer(state, action)

    const isContentExpanded = state.contentVisibilityDict[entryId]

    if (isFocused) {
      if (!selectors.getFocusedEntry(state).content)
        return reduceActions([actions.toggleFocus({ entryId })])

      if (isContentExpanded)
        return reduceActions([actions.toggleContent({ entryId }), actions.toggleFocus({ entryId })])

      return reduceActions([actions.toggleContent({ entryId })])
    } else return reduceActions([actions.jump({ entryId })])
  })

  .handleAction(actions.blurItem, (state) => ({
      ...state,
      isFocused: false
  }))

  .handleAction(actions.jump, (state, { payload: { entryId } }) => {
    return produce(state, draft => {
      draft.jumpList = [entryId, ...state.jumpList]
      draft.isFocused = true
    })
  })

export default interactionsReducer
