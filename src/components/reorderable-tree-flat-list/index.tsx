/**
 * Visualizes entries as reorderable trees
 ** DONE use in EntryList and measure performance impact
 ** DONE add props types
 ** DONE apply reorder
 ** DONE handle activation
 ** TODO snap to grid / not available moves block
 ** TODO use headline as FakeEntry
 ** TODO optimize move triggers
 ** TODO add scroll triggered by position from end or beginning
 ** TODO add folding cycle when tapping outline button
 */
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
import { Refs } from './types';

// prettier-ignore
type Props = {
  ordering: string[]
  setOrdering: (ordering: string[]) => void
  foldDict: {[ itemId: string ]: 'children' | 'hidden' | 'all'}
  itemDict: []
} & typeof defaultProps & React.ComponentProps<typeof FlatList>

const defaultProps = {}

function ReorderableTreeFlatList({ renderItem, ...props }: Props) {
  /**
   * Constants
   */
  const { ordering, setOrdering } = props
  const [selectedItemId, setSelectedItem] = useState(null)

  /**
   * Refs
   */
  const refs = useRef<Refs>({
    itemHeights: {},
    scrollPosition: 0,
    temporaryItem: {
      translateY: new Animated.Value(0),
    },
    targetIndicator: {
      offset: new Animated.Value(0),
      opacity: new Animated.Value(0.2),
    },
    move: {
      fromPostion: null,
      toPostion: null,
    },
    lastOffset: 0,
  })

  const data = refs.current

  /**
   * Gesture activation/deactivation
   */
  const [active, setActive] = useState(false)

  const activateCallback = useCallback(
    itemPosition => {
      // Select for touch
      // TODO in this layer only position should be id, there are no dict [id, id, id]
      const offset = getItemOffset(itemPosition, ordering, data.itemHeights)
      data.temporaryItem.translateY.setOffset(offset - data.scrollPosition)
      data.temporaryItem.translateY.setValue(0)
      data.move.fromPostion = itemPosition

      data.lastOffset = offset
      const selectedItemId = props.ordering[itemPosition]
      setSelectedItem(selectedItemId)
      setActive(true)
    },
    [ordering]
  )

  const deactivateCallback = useCallback(itemPosition => {
    setActive(false)
  }, [])

  const panState$ = new BehaviorSubject()
    .pipe(filter(event => event !== undefined))

  /**
   * Release
   */
  panState$
    .subscribe(
      ({
        nativeEvent: { oldState, translationX, translationY },
      }: PanGestureHandlerStateChangeEvent) => {
        if (oldState === State.ACTIVE) {

          const fromPosition = data.move.fromPostion
          const toPosition = data.move.toPostion > fromPosition ? data.move.toPostion - 1 : data.move.toPostion

          const offset = getItemOffset(toPosition, ordering, data.itemHeights) - data.scrollPosition
          data.temporaryItem.translateY.setOffset(offset)
          data.temporaryItem.translateY.setValue(0)
          data.targetIndicator.offset.setValue(offset)

          const newOrdering = changeItemPosition(fromPosition, toPosition , ordering)
          setOrdering(newOrdering)
          deactivateCallback(toPosition)
          data.targetIndicator.opacity.setValue(0.01)
        }
      }
    )

  const panHandlerStateCallback = useCallback(event => panState$.next(event), [ordering])

  /**
   * Track Pan Gesture
   */
  const pan$ = new BehaviorSubject().pipe(
    filter((event: PanGestureHandlerGestureEvent) => event !== undefined)
  )

  // Calculate position of temporary item
  pan$.subscribe(({ nativeEvent: { translationX, translationY } }) => {
    data.temporaryItem.translateY.setValue(translationY)
  })

  // Calculate position of targer indicator
  pan$
    .pipe(
      map(event => event.nativeEvent.absoluteY),
      map((y) => (y-data.itemHeights[ordering[data.move.fromPostion]])),
      map(absoluteY => getItemInfo(absoluteY, data.scrollPosition, data.itemHeights, ordering))
    )
    .subscribe(([position, offset]) => {
      data.targetIndicator.offset.setValue(offset - 2)
      data.targetIndicator.opacity.setValue(1)
      data.move.toPostion = position
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
      const newLocal = data.lastOffset - data.scrollPosition
      data.temporaryItem.translateY.setOffset(newLocal)
      data.temporaryItem.translateY.setValue(0)
    })

  const onScrollEventCallback = useCallback(event => scroll$.next(event), [])

  /**
   * Item size measurement and cache
   */
  const itemLayoutCallback = useCallback((event: LayoutChangeEvent, itemId: number) => {
    refs.current.itemHeights[itemId] = event.nativeEvent.layout.height
  }, [])

  /**
   * Render item
   */
  const renderItemCallback = ({ item, index }) =>
    renderItem({
      item,
      position: index,
      itemLayoutCallback,
      activateCallback,
      deactivateCallback,
    })

  const renderTemporaryItemCallback = () =>
    renderItem({
      item: props.itemDict[selectedItemId],
      iconName: 'circle-notch',
      highlighted: true,
    })

  const items = ordering.map(id => props.itemDict[id])

  /**
   * Render component
   */
  console.tron.debug('render')
  return (
    <ReorderableTreeFlatListContext.Provider value={refs}>
      <View>
        <FlatList
          renderItem={renderItemCallback}
          data={items}
          onScroll={onScrollEventCallback}
          {...props}
        />

        {active && (
          <PanGestureHandler
            onGestureEvent={onPanCallback}
            onHandlerStateChange={panHandlerStateCallback}
          >
            <Animated.View
              style={[styles.temporaryItem, { transform: [{ translateY: data.temporaryItem.translateY }] }]}
            >
              {renderTemporaryItemCallback()}
            </Animated.View>
          </PanGestureHandler>
        )}

        <Animated.View
          style={[
            styles.targetIndicator,
            { opacity: data.targetIndicator.opacity },
            { transform: [{ translateY: data.targetIndicator.offset }] },
          ]}
        />
      </View>
    </ReorderableTreeFlatListContext.Provider>
  )
}

ReorderableTreeFlatList.defaultProps = defaultProps

export const ReorderableTreeFlatListContext = React.createContext<Context>({})

const getStateName = state =>
  Object.entries(State)
    .filter(el => el[1] === state)
    .map(el => el[0])

export default gestureHandlerRootHOC(ReorderableTreeFlatList)
