import React, { useCallback, useRef, useState } from 'react'
import { Text, View, Animated, LayoutChangeEvent, Vibration } from 'react-native'
import { BehaviorSubject, Subject } from 'rxjs'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandler,
  State,
  gestureHandlerRootHOC,
  FlatList,
} from 'react-native-gesture-handler'
import { map, filter, tap, bufferCount } from 'rxjs/operators'

import styles from './styles'
import { applyChanges, shiftDraggableLevel } from './helpers'
import { Refs } from './types'
import { LevelIndicator, Icon } from 'elements'
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
} from './animations'
import { LEVEL_SHIFT_TRIGGER } from './constants'
type Props = {
  itemDict: object
  ordering: string[]
  levels: number[]
  visibility: boolean[]
  setOrdering: (ordering: string[]) => void
  setLevels: (levels: number[]) => void
} & typeof defaultProps &
  React.ComponentProps<typeof FlatList>

const defaultProps = {}

function ReorderableTreeFlatList({ renderItem, ...props }: Props) {
  const bench = useMeasure('ReorderableTree')

  const refs = useRef<Refs>({
    itemHeights: {},
    draggable: {
      translateY: new Animated.Value(0),
      startX: 0,
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
    scrollPosition: 0,
    lastOffset: 0,
    moveDirection: 'h',
  })

  const { ordering, setOrdering, levels, setLevels } = props

  const [draggableItemLevel, setDraggableItemLevel] = useState()
  const [activeItemId, setActiveItemId] = useState(null)

  const activeItem = props.itemDict[activeItemId]
  const data = refs.current

  /**
   * Observables
   */
  const panState$ = new Subject().pipe(
    map(({ nativeEvent }: PanGestureHandlerStateChangeEvent) => [
      nativeEvent.state,
      nativeEvent.oldState,
      nativeEvent.translationX,
    ])
  )

  const dragEnd$ = panState$.pipe(
    map(([_, oldState]) => oldState),
    filter(oldState => oldState === State.ACTIVE)
  )

  const dragStart$ = panState$.pipe(
    filter(([state, oldState, translationX]) => state === State.ACTIVE)
  )

  const pan$ = new Subject().pipe(map((event: PanGestureHandlerGestureEvent) => event.nativeEvent))

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
        (acc, [x, y]) => {
          acc[0] += Math.abs(x)
          acc[1] += Math.abs(y)
          return acc
        },
        [0, 0]
      )
      return accumulatedVelocity[0] > accumulatedVelocity[1] ? 'h' : 'v'
    })
  )

  /**
   * Gesture activation/deactivation
   */
  const turnItemToDraggable = useCallback(
    itemPosition => {
      const activeItemId = props.ordering[itemPosition]
      const activeItemLevel = levels[itemPosition]
      const absoluteItemOffset = getAbsoluteItemPositionOffset(
        itemPosition,
        ordering,
        data.itemHeights
      )

      data.draggable.translateY.setOffset(absoluteItemOffset - data.scrollPosition)
      data.draggable.translateY.setValue(0)
      data.draggable.level.setValue(getItemLevelOffset(activeItemLevel))

      data.move.fromPosition = itemPosition
      data.move.toPosition = itemPosition
      data.move.toLevel = activeItemLevel

      data.draggable.startX = 0
      data.lastOffset = absoluteItemOffset

      setActiveItemId(activeItemId)
      setDraggableItemLevel(activeItemLevel)
      startActivateAnimation(data)
    },
    [ordering, levels]
  )

  /**
   * Track Pan Gesture
   */

  moveDirection$.subscribe(direction => {
    data.moveDirection = direction
  })

  pan$.subscribe(({ translationX, translationY }) => {
    data.panGesture.translateX = translationX
    data.panGesture.translateY = translationY

    if (data.moveDirection === 'v') {
      data.draggable.translateY.setValue(translationY)
    }
  })

  targetHasChanged$.subscribe(([newPosition, newOffset]) => {
    data.move.toPosition = newPosition
    data.draggable.startX = data.panGesture.translateX

    data.targetIndicator.opacity.setValue(1)
    data.targetIndicator.translateY.setValue(newOffset - 2)

    const targetLevel = levels[newPosition - 1]
    if (data.move.toLevel !== targetLevel) {
      data.move.toLevel = targetLevel
      data.draggable.level.stopAnimation()
      startShiftLevelAnimation(data)
    }
  })

  // TODO Level shift
  pan$.subscribe(({ translationX }) => {
    const dx = data.draggable.startX - translationX

    if (Math.abs(dx) > LEVEL_SHIFT_TRIGGER && data.moveDirection === 'h') {
      shiftDraggableLevel(data, ordering, levels, dx > 0 ? 'left' : 'right')
      startShiftLevelAnimation(data)
      data.draggable.startX = translationX
    }
  })

  const onPanCallback = useCallback(event => pan$.next(event), [levels, ordering])

  /**
   * Release and apply changes
   */
  dragEnd$.subscribe(() => {
    startReleaseAnimation(data, ordering)
    data.targetIndicator.opacity.setValue(0.01)
    data.draggable.startX = 0

    const [newOrdering, newLevels] = applyChanges(data, ordering, levels)
    setOrdering(newOrdering)
    setLevels(newLevels)
  })

  const panHandlerStateCallback = useCallback(event => panState$.next(event), [ordering, levels])

  /**
   * TODO Compensate flatlist scroll
   */
  const scroll$ = new BehaviorSubject()
    .pipe(filter(event => event !== undefined))
    .subscribe(({ nativeEvent: { contentOffset } }) => {
      const height = contentOffset.y | 0
      data.scrollPosition = height
      const baseLevel = data.lastOffset - data.scrollPosition
      data.draggable.translateY.setOffset(baseLevel)
      data.draggable.translateY.setValue(0)
    })

  const onScrollEventCallback = useCallback(event => scroll$.next(event), [])

  /**
   * TODO Item size measurement and cache
   */
  const onItemLayout = useCallback((event: LayoutChangeEvent, itemId: number) => {
    refs.current.itemHeights[itemId] = event.nativeEvent.layout.height
  }, [])

  /**
   * Render
   */
  const renderItemCallback = useCallback(
    ({ item, index }) => (
      <View style={styles.row} onLayout={event => onItemLayout(event, item.id)}>
        <LevelIndicator
          level={levels[index]}
          position={index}
          iconName="circle"
          onPress={turnItemToDraggable}
        />
        {renderItem({ item, level: levels[index] })}
      </View>
    ),
    [ordering, levels]
  )

  bench.step('reorderable')
  return (
    <ReorderableTreeFlatListContext.Provider value={refs}>
      <View>
        <FlatList
          renderItem={renderItemCallback}
          data={getItems(props)}
          onScroll={onScrollEventCallback}
          {...props}
        />

        {activeItemId && (
          <PanGestureHandler
            onGestureEvent={onPanCallback}
            onHandlerStateChange={panHandlerStateCallback}
          >
            <Animated.View
              style={[
                styles.temporaryItem,
                {
                  opacity: data.draggable.opacity,
                  transform: [{ translateY: data.draggable.translateY }],
                },
              ]}
            >
              <Animated.View
                style={[styles.row, { transform: [{ translateX: data.draggable.level }] }]}
              >
                <Icon name="circleNotch" />
                <Text> </Text>
                {renderItem({ item: activeItem, level: draggableItemLevel })}
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>
        )}

        <Animated.View
          style={[
            styles.targetIndicator,
            { opacity: data.targetIndicator.opacity },
            { transform: [{ translateY: data.targetIndicator.translateY }] },
          ]}
        />
      </View>
    </ReorderableTreeFlatListContext.Provider>
  )
}

ReorderableTreeFlatList.defaultProps = defaultProps

export const ReorderableTreeFlatListContext = React.createContext<Context>({})

export default gestureHandlerRootHOC(ReorderableTreeFlatList)
