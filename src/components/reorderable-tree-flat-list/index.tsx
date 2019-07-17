import React, { useCallback, useRef, useState, useLayoutEffect, useEffect } from 'react'
import { View, Animated, LayoutChangeEvent, LayoutAnimation, InteractionManager, Text } from 'react-native'
import { Subject } from 'rxjs'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandler,
  PinchGestureHandler,
  State,
  gestureHandlerRootHOC,
  FlatList,
  PinchGestureHandlerStateChangeEvent,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler'
import { map, filter, bufferCount, bufferTime } from 'rxjs/operators'

import { Refs } from './types'
import { LEVEL_SHIFT_TRIGGER } from './constants'
import styles from './styles'
import { applyChanges, shiftDraggableItemLevel, getItemLayout } from './helpers'
import  LevelIndicator  from './level-indicator'
import { useMeasure } from 'helpers/hooks'
import {
  getAbsoluteItemPositionOffset,
  getItemLevelOffset,
  getItems,
  getItemInfo,
} from './selectors'
import {
  startActivateAnimation,
  startReleaseAnimation,
  startShiftLevelAnimation,
  foldAnimation,
} from './animations'
import { cycleItemVisibility, moreDetails, lessDetails, hasHiddenChildren } from './visibility'
import Draggable from './draggable';

type Props = {
  itemDict: object
  ordering: string[]
  levels: number[]
  setOrdering: (ordering: string[]) => void
  setLevels: (levels: number[]) => void
  addItem: (item) => void
} & typeof defaultProps &
  React.ComponentProps<typeof FlatList>

const defaultProps = {}

function ReorderableTreeFlatList({ renderItem, ...props }: Props) {
  const bench = useMeasure('ReorderableTree')

  const refs = useRef<Refs>({
    itemHeights: {},
    draggable: {
      translateY: new Animated.Value(0),
      levelOffset: 0,
      level: new Animated.Value(0),
      opacity: new Animated.Value(0),
    },
    targetIndicator: {
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.2),
    },
    move: {
      fromPosition: null,
      toPosition: null,
      toLevel: null,
    },
    panGesture: {
      x: 0,
      y: 0,
    },
    text: new Animated.Value('sdf'),
    scrollPosition: 0,
    pinchGesture: {
      isActive: false,
    },
    lastOffset: 0,
    moveDirection: 'h',
    newItemPosition: null,
  })

  const { ordering, setOrdering, levels, setLevels } = props

  const [hideDict, setVisibility] = useState(() =>
    ordering.reduce((acc, id) => ({ ...acc, [id]: false }), {})
  )

  const data = refs.current

  /**
   * Measures
   */
  const onItemLayoutCallback = useCallback((event: LayoutChangeEvent, itemId: number) => {
    refs.current.itemHeights[itemId] = event.nativeEvent.layout.height
  }, [])

  /**
   * Draggable
   */
  const turnItemToDraggableCallback = useCallback(
    (itemPosition, item) => {
      const itemLevel = levels[itemPosition]
      const absoluteItemOffset = getAbsoluteItemPositionOffset(
        itemPosition,
        ordering,
        hideDict,
        data.itemHeights
      )

      data.draggable.translateY.setOffset(absoluteItemOffset - data.scrollPosition)
      data.draggable.translateY.setValue(0)
      data.draggable.level.setValue(getItemLevelOffset(itemLevel))

      data.move.fromPosition = itemPosition
      data.move.toPosition = itemPosition
      data.move.toLevel = itemLevel

      data.draggable.levelOffset = 0
      data.lastOffset = absoluteItemOffset

      draggableRef.current.setNativeProps(item ? {
        item,
        level: item.level,
        position: itemPosition
      } : {
        item: props.itemDict[ordering[itemPosition]],
        level: itemLevel,
        position: itemPosition
      })

      if (item) draggableRef.current.edit()
      startActivateAnimation(data)
    },
    [ordering, levels, hideDict]
  )

  const cycleSubtreeVisibilityCallback = useCallback(
    position => setVisibility(cycleItemVisibility(position, ordering, levels, hideDict)),
    [ordering, levels, hideDict]
  )

  /**
   * Pan Gesture
   */
  const pan$ = new Subject<PanGestureHandlerGestureEvent>().pipe(map(event => event.nativeEvent))
  const onPanCallback = useCallback(event => pan$.next(event), [levels, ordering])

  const panState$ = new Subject<PanGestureHandlerStateChangeEvent>().pipe(
    map(({ nativeEvent }) => [nativeEvent.state, nativeEvent.oldState, nativeEvent.translationX])
  )
  const onPanHandlerStateCallback = useCallback(event => panState$.next(event), [ordering, levels])

  const targetHasChanged$ = pan$.pipe(
    map(({ absoluteY }) => absoluteY),
    map(y => y - data.itemHeights[ordering[data.move.fromPosition]] * 1.5),
    map(absoluteY => getItemInfo(data, absoluteY, ordering)),
    filter(([position, _]) => data.move.toPosition !== position && data.moveDirection === 'v')
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

  const dragEnd$ = panState$.pipe(
    map(([_, oldState]) => oldState),
    filter(oldState => oldState === State.ACTIVE)
  )

  pan$.subscribe(({ translationX, translationY }) => {
    data.panGesture.translateX = translationX
    data.panGesture.translateY = translationY

    switch (data.moveDirection) {
      case 'v':
        data.draggable.translateY.setValue(translationY)
        break
      case 'h':
        const dx = data.draggable.levelOffset - translationX
        if (Math.abs(dx) > LEVEL_SHIFT_TRIGGER) {
          shiftDraggableItemLevel(data, levels, dx > 0 ? 'left' : 'right')
          startShiftLevelAnimation(data)
          data.draggable.levelOffset = translationX
          draggableRef.current.setNativeProps({
            level: data.move.toLevel,
          })
        }
        break
    }
  })

  moveDirection$.subscribe(direction => {
    data.moveDirection = direction
  })

  targetHasChanged$.subscribe(([newPosition, newOffset]) => {
    data.move.toPosition = newPosition
    data.draggable.levelOffset = data.panGesture.translateX

    data.targetIndicator.opacity.setValue(1)
    data.targetIndicator.translateY.setValue(newOffset - 2)

    const targetLevel = levels[newPosition - 1]
    if (data.move.toLevel !== targetLevel) {
      data.move.toLevel = targetLevel
      data.draggable.level.stopAnimation()
      startShiftLevelAnimation(data)
    }

    draggableRef.current.setNativeProps({
      level: targetLevel,
      position: newPosition
    })
  })

  dragEnd$.subscribe(() => {
    startReleaseAnimation(data, ordering, hideDict)
    data.targetIndicator.opacity.setValue(0.01)
    data.draggable.levelOffset = 0

    const [newOrdering, newLevels] = applyChanges(data, ordering, levels)
    setOrdering(newOrdering)
    setLevels(newLevels)
  })

  /**
   * Scroll
   */
  const scroll$ = new Subject()
  const onScrollEventCallback = useCallback(event => scroll$.next(event), [])

  scroll$.subscribe(({ nativeEvent: { contentOffset } }) => {
    const height = contentOffset.y | 0
    const baseLevel = data.lastOffset - height

    data.scrollPosition = height
    data.draggable.translateY.setOffset(baseLevel)
    data.draggable.translateY.setValue(0)
  })

  /**
   * Pinch gesture
   */
  const pinch$ = new Subject<PinchGestureHandlerGestureEvent>().pipe(
    map(event => event.nativeEvent)
  )

  const onPinchCallback = useCallback(event => pinch$.next(event), [levels, ordering, hideDict])

  const pinchState$ = new Subject<PinchGestureHandlerStateChangeEvent>().pipe(
    map(({ nativeEvent }) => nativeEvent.state),
    filter(state => state === State.ACTIVE)
  )

  const onPinchStateCallback = useCallback(event => pinchState$.next(event), [
    ordering,
    levels,
    hideDict,
  ])

  pinchState$.subscribe(state => {
    data.pinchGesture.isActive = true
  })

  pinch$
    .pipe(
      /* auditTime(100), */
      map(event => event.scale),
      bufferTime(100),
      map(scales => [scales[0] > scales[2] ? 'in' : 'out', scales[0]])
    )
    .subscribe(([direction, scale]) => {
      if (data.pinchGesture.isActive && scale > 0.5) {
        const transformVisibility = direction === 'in' ? lessDetails : moreDetails
        setVisibility(transformVisibility(ordering, levels, hideDict))
        data.pinchGesture.isActive = false
      }
    })

  /**
   * Add/Delete/Edit item
   */
  const addItemCallback = useCallback((placement: 'top' | 'bottom') => {
    const position = data.move.fromPosition
    const level = levels[position]
    const item = {
      position,
      level,
      headline: '',
      tags: []
    };
    turnItemToDraggableCallback(position, item)
    setTimeout(() => {
      props.addItem(item)
    }, 50)

  } ,[levels, ordering])

  /**
   * Render
   */
  useLayoutEffect(() => {
    LayoutAnimation.configureNext(foldAnimation)
  }, [hideDict])

  const renderItemCallback = useCallback(
    ({ item, index }) => {
      return (
        (!hideDict[item.id]) && (
          <View style={styles.item} onLayout={event => onItemLayoutCallback(event, item.id)}>
            <LevelIndicator
              level={levels[index]}
              hasHiddenChildren={hasHiddenChildren(index, hideDict, ordering, levels)}
              position={index}
              onPress={cycleSubtreeVisibilityCallback}
            />
            {renderItem({
              item,
              level: levels[index],
              position: index,
              defaultAction: turnItemToDraggableCallback,
            })}
          </View>
        )
      )
    },
    [ordering, levels, hideDict]
  )
  const items = getItems(props)
  const draggableRef = useRef()
  bench.step('reorderable')
  return (
    <ReorderableTreeFlatListContext.Provider value={refs}>
      <PinchGestureHandler
        numberOfPointers={2}
        onGestureEvent={onPinchCallback}
        onHandlerStateChange={onPinchStateCallback}
      >
        <View>
          <FlatList
            renderItem={renderItemCallback}
            data={items}
            getItemLayout={getItemLayout}
            onScroll={onScrollEventCallback}
            {...props}
          />

          <PanGestureHandler
              onGestureEvent={onPanCallback}
              onHandlerStateChange={onPanHandlerStateCallback}
            >
              <Animated.View
                style={[
                  styles.temporaryItem,
                  {
                    opacity: data.draggable.opacity,
                    transform: [{ translateY: data.draggable.translateY }],
                  },
                ]}>
                <Animated.View
                  style={[styles.row, { transform: [{ translateX: data.draggable.level }] }]}
                >
                  <Draggable
                    onAddButtonPress={addItemCallback}
                    onPress={cycleSubtreeVisibilityCallback}
                    renderItem={renderItem}
                    ref={draggableRef}
                    />
                </Animated.View>
              </Animated.View>
            </PanGestureHandler>


          <Animated.View
            style={[
              styles.targetIndicator,
              { opacity: data.targetIndicator.opacity },
              { transform: [{ translateY: data.targetIndicator.translateY }] },
            ]}
          />
        </View>
      </PinchGestureHandler>
    </ReorderableTreeFlatListContext.Provider>
  )
}

ReorderableTreeFlatList.defaultProps = defaultProps

export const ReorderableTreeFlatListContext = React.createContext<Context>({})

export default gestureHandlerRootHOC(ReorderableTreeFlatList)
