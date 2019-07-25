import React, { useCallback } from 'react'
import { Subject } from 'rxjs'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State,
} from 'react-native-gesture-handler'
import { map, filter, bufferCount } from 'rxjs/operators'
import { LEVEL_SHIFT_TRIGGER } from './constants'
import { endDragAnimation, startDragAnimation, startShiftLevelAnimation } from './animations'
import { Refs, AnimatedValues } from '.'
import { applyChanges } from "./applyChanges";
import { ItemData } from './types'
import ItemDraggable from './ItemDraggable'
import { getItemInfo } from './useItems'

export function usePanGesture(
  { levels, ordering, hideDict }: ItemData,
  data: Refs,
  draggableRef: React.MutableRefObject<ItemDraggable>,
  setOrdering: (ordering: string[]) => void,
  setLevels: (levels: number[]) => void,
  animatedValues: AnimatedValues
) {
  const pan$ = new Subject<PanGestureHandlerGestureEvent>().pipe(map(event => event.nativeEvent))

  const panState$ = new Subject<PanGestureHandlerStateChangeEvent>().pipe(
    map(({ nativeEvent }) => [nativeEvent.state, nativeEvent.oldState, nativeEvent.translationX])
  )

  const onPanCallback = useCallback(event => pan$.next(event), [levels, ordering, hideDict])
  const onPanHandlerStateCallback = useCallback(event => panState$.next(event), [
    ordering,
    levels,
    hideDict,
  ])

  const targetHasChanged$ = pan$.pipe(
    map(({ absoluteY }) => absoluteY),
    map(y => y - data.itemHeights[data.move.fromPosition] * 1),
    map(absoluteY => getItemInfo(data, absoluteY, ordering, hideDict)),
    filter(([position, _]) => data.move.toPosition !== position && data.moveAxis === 'v')
  )

  const moveDirection$ = pan$.pipe(
    map(({ velocityX, velocityY }) => [velocityX, velocityY]),
    bufferCount(15),
    map(velocity => {
      const accumulatedVelocity = velocity.reduce(
        (acc, [x, y]) => [acc[0] + Math.abs(x), acc[1] + Math.abs(y)],
        [0, 0]
      )
      return accumulatedVelocity[0] > accumulatedVelocity[1] ? 'h' : 'v'
    })
  )

  const dragStart$ = panState$.pipe(filter(([state]) => state === State.ACTIVE))
  const dragEnd$ = panState$.pipe(filter(([_, oldState]) => oldState === State.ACTIVE))

  pan$.subscribe(({ translationX, translationY }) => {
    data.panGesture.translateX = translationX
    data.panGesture.translateY = translationY
    switch (data.moveAxis) {
      case 'v':
        break
      case 'h':
        const dx = data.draggable.levelOffset - translationX
        if (Math.abs(dx) > LEVEL_SHIFT_TRIGGER) {
          shiftDraggableItemLevel(data, levels, dx > 0 ? 'left' : 'right')
          startShiftLevelAnimation(animatedValues, data)
          data.draggable.levelOffset = translationX
          draggableRef.current.setState({
            level: data.move.toLevel,
          })
        }
        break
    }
  })

  moveDirection$.subscribe(direction => {
    data.moveAxis = direction
  })

  targetHasChanged$.subscribe(([newPosition, newOffset]) => {
    data.move.toPosition = newPosition
    data.draggable.levelOffset = data.panGesture.translateX
    animatedValues.targetIndicator.opacity.setValue(1)
    animatedValues.targetIndicator.translateY.setValue(newOffset - 2)
    const targetLevel = levels[newPosition - 1]
    if (data.move.toLevel !== targetLevel) {
      data.move.toLevel = targetLevel
      animatedValues.draggable.level.stopAnimation()
      startShiftLevelAnimation(animatedValues, data)
    }
    draggableRef.current.setState({
      level: targetLevel,
      position: newPosition,
    })
  })

  dragStart$.subscribe(() => {
    draggableRef.current.setState({
      itemState: 'dragged',
    })
    startDragAnimation(animatedValues)
  })

  dragEnd$.subscribe(() => {
    draggableRef.current.setState({
      itemState: 'inactive',
    })
    endDragAnimation(animatedValues, data, ordering, hideDict)
    animatedValues.targetIndicator.opacity.setValue(0.01)
    data.draggable.levelOffset = 0
    const [newOrdering, newLevels] = applyChanges(data, ordering, levels)
    setOrdering(newOrdering)
    setLevels(newLevels)
  })
  return { onPanCallback, onPanHandlerStateCallback }
}

export function shiftDraggableItemLevel(data: Refs, levels: number[], direction: 'left' | 'right') {
  const delta = direction === 'right' ? 1 : -1
  const currentItemLevel = data.move.toLevel
  const prevItemLevel = levels[data.move.toPosition - 1]
  const newLevel = currentItemLevel + delta
  if (newLevel > 0 && newLevel <= prevItemLevel + 1) {
    data.move.toLevel = newLevel
  }
}
