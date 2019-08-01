import React, { useRef, useEffect, useCallback } from 'react'
import { useUnifiedLists } from './useUnifiedLists'
import { InteractionManager } from 'react-native'
import actions from './actions'

export type ControlledListComponent = {
  focusItem: (index: number) => void
  isActiveRoute: boolean
  route: string
  unifiedListsApiRef: ReturnType<typeof useUnifiedLists>['unifiedListsApiRef']
} & object

export const UnifiedListsHOC = (WrappedComponent: ControlledListComponent) => ({
  isActiveRoute,
  route,
  position,
  unifiedListsApiRef: {
    current: { dispatch, state, focusedId },
  },
  ...props
}: React.ComponentProps<React.ComponentType<ControlledListComponent>>) => {
  const lastProps = useRef(null as typeof props | null)
  const flatListRef = useRef(null as ControlledListComponent | null)
  const onChangeFocusedItem = useCallback(({ position, item }) => {
    dispatch(actions.onFocusedItemChange({ position, item, route }))
  }, [])

  useEffect(() => {
    const currentId = focusedId.routes[route.key]
    const desiredId =
      route.key === 'workspace'
        ? focusedId.focusedWorkspaceId || focusedId.focusedFileId
        : focusedId.focusedEntryId

    if (flatListRef.current && isActiveRoute && desiredId && currentId !== desiredId) {
      flatListRef.current.focusItem(desiredId)
      flatListRef.current.scrollToItem(desiredId)
      focusedId.routes[route.key] = desiredId
    }
  })

  if (!lastProps.current) lastProps.current = props
  const flatlistProps = isActiveRoute ? props : lastProps.current
  lastProps.current = props

  return (
    <WrappedComponent
      onChangeFocusedItem={onChangeFocusedItem}
      {...flatlistProps}
      ref={flatListRef}
    />
  )
}
