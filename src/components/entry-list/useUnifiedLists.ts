import { useRef, useState, useImperativeHandle, useEffect } from 'react'
import { createReducer, createStandardAction as action } from 'typesafe-actions'
import { useDebugReducer } from 'helpers/hooks'
import actions from './actions'
import { pipe, ifElse, propEq, cond } from 'ramda';

export const initialState = {
  index: 0,
  routes: [
    { key: 'workspace', title: 'Workspace'},
    { key: 'outliner', title: 'Outliner' },
    { key: 'visitor', title: 'Visitor' },
  ],
}

const activateNextRoute = state => ({
    ...state,
    index: state.index + 1,
});

export function useUnifiedLists(lists) {
  const focusedIdRef = useRef({
    focusedFileId: null,
    focusedWorkspaceId: null,
    focusedEntryId: null,
    routes: {
      'workspace': null as  string | null,
      'outliner': null as  string | null,
      'visitor': null as  string | null,
    }
  })

  const focusedId = focusedIdRef.current

  const [state, dispatch] = useDebugReducer(
    createReducer(initialState)
      .handleAction(actions.onIndexChange, (state, { payload }) => ({
        ...state,
        index: payload,
      }))
      .handleAction(actions.activateNextRoute, activateNextRoute)
      .handleAction(
        actions.onFocusedItemChange,
        (state, { payload: { route, item, position } }) => {
          switch (item.type) {
            case 'workspace':
              focusedId.focusedWorkspaceId = item.id
              focusedId.focusedEntryId = null
              focusedId.routes['outliner'] = null
              focusedId.routes['visitor'] = null
              focusedId.routes[route.key] = item.id
              return pipe(
                activateNextRoute
              )(state)
            case 'file':
              focusedId.focusedFileId = item.id
              focusedId.focusedEntryId = null
              focusedId.focusedWorkspaceId = null
              focusedId.routes['outliner'] = null
              focusedId.routes['visitor'] = null
              focusedId.routes[route.key] = item.id
              return state
            default:
              focusedId.focusedEntryId = item.id
              focusedId.routes[route.key] = item.id
              return state
          }
        }
      ),
    initialState,
    (state: typeof initialState) => {
      return state
    }
  )

  const unifiedListsApiRef = useRef({
    state,
    dispatch,
    focusedId
  })

  const activeRoute = state.routes[state.index]
  const navigationState = state
  return { unifiedListsApiRef, navigationState, activeRoute }
}
