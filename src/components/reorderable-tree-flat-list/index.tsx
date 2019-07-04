// * Visualizes entries as reorderable trees
// ** DONE use in EntryList and measure performance impact
// ** DONE add props types
// ** DONE apply reorder
// ** DONE handle activation
// ** TODO snap to grid / not available moves block
// ** TODO use headline as FakeEntry
// ** TODO optimize move triggers
// ** TODO add scroll triggered by position from end or beginning
// ** TODO add folding cycle when tapping outline button

import React, { useCallback, useRef, useState, useMemo } from 'react'
import {
  View,
  Text,
  Animated,
  StyleSheet,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native'
import { BehaviorSubject, Observable } from 'rxjs'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandler,
  State,
  gestureHandlerRootHOC,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native-gesture-handler'
import { useObservable, useEventCallback } from 'rxjs-hooks'
import { interval } from 'rxjs'
import { map, tap, debounceTime, auditTime, filter } from 'rxjs/operators'
import { path, prop, of, reduceWhile } from 'ramda'
import { posix } from 'path'

import styles from './styles'
import { OrgEntry } from 'core/entries/store/types'
import { getItemInfo, getItemOffset, changeItemPosition } from './helpers'

// prettier-ignore
type Props = {
  ordering: string[]
  setOrdering: () => void
  foldDict: {[ itemId: string ]: 'children' | 'hidden' | 'all'}
} & typeof defaultProps

const defaultProps = {}

function ReorderableTreeFlatList({ renderItem, ...props }: React.ComponentProps<typeof FlatList>) {
  const [ordering, setOrdering] = useState(props.ordering)
  const [temporaryEntryLevel, setFakeEntryLevel] = useState(0)
  const [temporaryEntryPosition, setFakeEntryPosition] = useState(0)

  const refs = useRef(
    (() => ({
      targetItemIndex: null,
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      scrollPosition: 0,
      lastOffset: { x: 0, y: 0 },
      lastTouchedItemIndex: null,
      rowHeights: {},
      indicatorOffset: new Animated.Value(0),
      indicatorOpacity: new Animated.Value(0.2),
      targetPosition: null,
    }))()
  )

  const data = refs.current

  /**
   * Gesture activity
   */
  const [active, setActive] = useState(false)

  const activateCallback = useCallback(itemIndex => {
    // Select for touch
    // TODO in this layer only position should be id, there are no dict [id, id, id]
    const offset = getItemOffset(itemIndex, ordering, data.rowHeights)
    data.lastOffset.y = offset
    data.translateY.setOffset(offset - data.scrollPosition)
    data.translateY.setValue(0)
    data.lastTouchedItemIndex = itemIndex
    setActive(true)
  }, [])

  const deactivateCallback = useCallback(itemIndex => {
    setActive(false)
  }, [])

  const panState$ = new BehaviorSubject()

  panState$
    .pipe(filter(event => event !== undefined))
    .subscribe(
      ({
        nativeEvent: { oldState, translationX, translationY },
      }: PanGestureHandlerStateChangeEvent) => {
        if (oldState === State.ACTIVE) {
          data.lastOffset.y += translationY
          data.indicatorOpacity.setValue(0.01)

          data.translateY.setValue(data.lastOffset.y)
          data.translateX.setOffset(0)
          data.translateY.setOffset(translationY)
          data.translateY.setOffset(0)

          const fromPosition = data.lastTouchedItemIndex
          const toPosition = data.targetPosition - 1

          const newOrdering = changeItemPosition(fromPosition, toPosition, ordering)
          setOrdering(newOrdering)
        }
      }
    )

  const panHandlerStateCallback = useCallback(event => panState$.next(event), [])

  /**
   * Track Pan Gesture
   */
  const pan$ = new BehaviorSubject().pipe(
    filter((event: PanGestureHandlerGestureEvent) => event !== undefined)
  )

  pan$.subscribe(({ nativeEvent: { translationX, translationY } }) => {
    data.translateX.setValue(translationX)
    data.translateY.setValue(translationY)
    data.lastOffset.y = translationY
  })

  pan$
    .pipe(
      map(event => event.nativeEvent.absoluteY),
      map(absoluteY => getItemInfo(absoluteY, 0, data.rowHeights, ordering))
    )
    .subscribe(([indicatorPosition, indicatorOffset]) => {
      data.indicatorOffset.setValue(indicatorOffset)
      data.indicatorOpacity.setValue(1)
      data.targetPosition = indicatorPosition
    })

  const onPanCallback = useCallback(event => pan$.next(event), [])

  /**
   * Compensate flatlist scroll
   */
  const scroll$ = new BehaviorSubject()
    .pipe(filter(event => event !== undefined))
    .subscribe(({ nativeEvent: { contentOffset } }) => {
      const height = contentOffset.y | 0
      data.scrollPosition = height
      const newLocal = data.lastOffset.y - data.scrollPosition
      data.translateY.setOffset(newLocal)
      data.translateY.setValue(0)
    })

  const onScrollEventCallback = useCallback(event => scroll$.next(event), [])

  /**
   * Item size measurement and cache
   */
  const itemLayoutCallback = useCallback((event: LayoutChangeEvent, itemId: number) => {
    refs.current.rowHeights[itemId] = event.nativeEvent.layout.height
  }, [])

  /**
   * Render
   */
  const renderCallback = useCallback(
    ({ item, index }) =>
      renderItem({
        item,
        position: index,
        itemLayoutCallback,
        activateCallback,
        deactivateCallback,
      }),
    []
  )

  console.tron.debug('render')
  return (
    <View>
      <FlatList renderItem={renderCallback} onScroll={onScrollEventCallback} {...props} />
      {active && (
        <PanGestureHandler
          onGestureEvent={onPanCallback}
          onHandlerStateChange={panHandlerStateCallback}
          {...props}
        >
          <Animated.View
            style={[
              styles.box,
              {
                transform: [{ translateY: data.translateY }],
                height: data.rowHeights[props.ordering[data.lastTouchedItemIndex]],
                backgroundColor: { 0: 'red', 1: 'yellow', 2: 'blue', 3: 'orange' }[
                  temporaryEntryLevel
                ],
              },
            ]}
          >
            <Animated.View
              style={[
                { transform: [{ translateX: data.translateX }] },
                { backgroundColor: 'pink', height: '100%', width: 20 },
              ]}
            ></Animated.View>
          </Animated.View>
        </PanGestureHandler>
      )}
      <Animated.View
        style={[
          styles.targetIndicator,
          {
            opacity: data.indicatorOpacity,
          },
          { transform: [{ translateY: data.indicatorOffset }] },
        ]}
      ></Animated.View>
    </View>
  )
}

ReorderableTreeFlatList.defaultProps = defaultProps

const getStateName = state =>
  Object.entries(State)
    .filter(el => el[1] === state)
    .map(el => el[0])

export default gestureHandlerRootHOC(ReorderableTreeFlatList)
