import {useCallback} from 'react'
import {createReducer} from 'typesafe-actions'
import {evolve, merge, insert, omit, remove, assoc} from 'ramda'

import actions from './actions'
import {useDebugReducer} from 'helpers/hooks'
import {NumberDict} from './types'

const initialState = {
  ordering: [] as string[],
  levels: {} as NumberDict,
  itemDict: {}, // TODO move from here becouse it is immutable here and thimg should be changed globally and I will only receive data
}

export function useItems(items: object[], unifiedListsApiRef) {
  const [state, dispatch] = useDebugReducer(reducer, initialState, (state: typeof initialState) => {
    const ordering = Object.keys(items).sort(
      (keyA, keyB) => items[keyA].position > items[keyB].position,
    )
    const levels = ordering.map(id => items[id].level)

    return {
      ...state,
      ordering,
      levels,
      itemDict: items,
      data: items,
    }
  })

  const useAction = (actionCreator, sideEffect) =>
    useCallback(payload => {
      dispatch(actionCreator(payload))
      sideEffect && sideEffect(payload)
    }, [])

  return [state, useAction, actions, dispatch]
}

const reducer = createReducer(initialState)
  .handleAction(actions.setEntriesOrdering, (state, {payload}) => ({
    ...state,
    ordering: payload,
  }))

  .handleAction(actions.setEntriesLevels, (state, {payload}) => ({
    ...state,
    levels: payload,
  }))

  .handleAction(actions.addItem, (state, {payload}) => {
    const id = payload.id
    return evolve(
      {
        itemDict: merge({[id]: {...payload, id}}),
        levels: insert(payload.position, payload.level),
        ordering: insert(payload.position, id),
      },
      state,
    )
  })

  .handleAction(actions.deleteItems, (state, {payload}) => {
    const position = payload[0]
    const id = state.ordering[position]
    return evolve(
      {
        itemDict: omit([id]),
        levels: remove(position, 1),
        ordering: remove(position, 1),
      },
      state,
    )
  })

  .handleAction(actions.changeItems, (state, {payload}) => {
    const item = payload[0]
    return evolve(
      {
        itemDict: assoc(item.id, item),
      },
      state,
    )
  })

  .handleAction(actions.openItem, (state, {payload}) => {
    const item = payload

    return state
  })
