import React, { useCallback, useRef, useState } from 'react'
import { Text, View, Animated, LayoutChangeEvent } from 'react-native'
import { Subject } from 'rxjs'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandler,
  State,
  gestureHandlerRootHOC,
  FlatList,
  TouchableOpacity,
} from 'react-native-gesture-handler'
import { map, filter, bufferCount } from 'rxjs/operators'

import { Refs } from './types'
import { LEVEL_SHIFT_TRIGGER } from './constants'
import styles from './styles'
import { applyChanges, shiftDraggableItemLevel, getItemLayout } from './helpers'
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
import { cycleSubtreeVisibility } from './visibility'

type Props = {
  itemDict: object
  ordering: string[]
  levels: number[]
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
    scrollPosition: 0,
    lastOffset: 0,
    moveDirection: 'h',
  })

  const { ordering, setOrdering, levels, setLevels } = props

  const [activeItemId, setDraggableItemId] = useState(null)
  const [visibility, setVisibility] = useState(() =>  ordering.reduce((acc, id) => ({...acc, [id]: true}), {}))

  const activeItem = props.itemDict[activeItemId]
  const data = refs.current

  /**
   * Observables
   */
  const panState$ = new Subject<PanGestureHandlerStateChangeEvent>().pipe(
    map(({ nativeEvent }) => [nativeEvent.state, nativeEvent.oldState, nativeEvent.translationX])
  )

  const dragEnd$ = panState$.pipe(
    map(([_, oldState]) => oldState),
    filter(oldState => oldState === State.ACTIVE)
  )

  const pan$ = new Subject<PanGestureHandlerGestureEvent>().pipe(map(event => event.nativeEvent))

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

  const scroll$ = new Subject()

  /**
   * Callbacks
   */
  const onPanCallback = useCallback(event => pan$.next(event), [levels, ordering])

  const onPanHandlerStateCallback = useCallback(event => panState$.next(event), [ordering, levels])

  const onScrollEventCallback = useCallback(event => scroll$.next(event), [])

  const onItemLayoutCallback = useCallback((event: LayoutChangeEvent, itemId: number) => {
    refs.current.itemHeights[itemId] = event.nativeEvent.layout.height
  }, [])

  const cycleSubtreeVisibilityCallback = useCallback(
    () =>
      setVisibility(cycleSubtreeVisibility(data.move.fromPosition, ordering, levels, visibility)),
    [ordering, levels, visibility]
  )

  const turnItemToDraggableCallback = useCallback(
    itemPosition => {
      const itemId = props.ordering[itemPosition]
      const itemLevel = levels[itemPosition]
      const absoluteItemOffset = getAbsoluteItemPositionOffset(
        itemPosition,
        ordering,
        visibility,
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

      setDraggableItemId(itemId)
      startActivateAnimation(data)
    },
    [ordering, levels, visibility]
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
        }
        break
    }
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
  })

  dragEnd$.subscribe(() => {
    startReleaseAnimation(data, ordering)
    data.targetIndicator.opacity.setValue(0.01)
    data.draggable.levelOffset = 0

    const [newOrdering, newLevels] = applyChanges(data, ordering, levels)
    setOrdering(newOrdering)
    setLevels(newLevels)
  })

  scroll$.subscribe(({ nativeEvent: { contentOffset } }) => {
    const height = contentOffset.y | 0
    const baseLevel = data.lastOffset - height

    data.scrollPosition = height
    data.draggable.translateY.setOffset(baseLevel)
    data.draggable.translateY.setValue(0)
  })

  /**
   * Render
   */
  const renderItemCallback = useCallback(
    ({ item, index }) => visibility[item.id] && (
      <View style={styles.row} onLayout={event => onItemLayoutCallback(event, item.id)}>
        <LevelIndicator
          level={levels[index]}
          position={index}
          iconName="circle"
          onPress={turnItemToDraggableCallback}
        />
        {renderItem({ item, level: levels[index] })}
      </View>
    ),
    [ordering, levels, visibility]
  )

  bench.step('reorderable')
  return (
    <ReorderableTreeFlatListContext.Provider value={refs}>
      <View>
        <FlatList
          renderItem={renderItemCallback}
          data={getItems(props)}
          getItemLayout={getItemLayout}
          onScroll={onScrollEventCallback}
          {...props}
        />

        {activeItemId && (
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
              ]}
            >
              <Animated.View
                style={[styles.row, { transform: [{ translateX: data.draggable.level }] }]}
              >
                <TouchableOpacity onPress={cycleSubtreeVisibilityCallback} >
                  <Icon name="circleNotch" />
                </TouchableOpacity>
                <Text> </Text>
                {renderItem({ item: activeItem, level: data.move.toLevel })}
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
