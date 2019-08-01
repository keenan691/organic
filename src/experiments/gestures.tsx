import React, { useCallback, useRef, useState } from 'react'
import { View, Text, Animated, StyleSheet, LayoutChangeEvent } from 'react-native'
import { BehaviorSubject, Observable } from 'rxjs'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  PanGestureHandler,
  State,
  gestureHandlerRootHOC,
  FlatList,
  TouchableOpacity,
} from 'react-native-gesture-handler'
import { useObservable, useEventCallback } from 'rxjs-hooks'
import { interval } from 'rxjs'
import { map, tap, debounceTime, auditTime } from 'rxjs/operators'
import { path, prop, of, reduceWhile } from 'ramda'
import { OrgEntry } from 'modules/entries/store/types'
import { posix } from 'path'
import Outliner from 'components/outliner';

type Props = {} & typeof defaultProps
const defaultProps = {}

/**
 * Visualizes entries as reorderable trees
 */
function GesturesTwoDimentionsReorder({
  renderItem,
  ...props
}: React.ComponentProps<typeof FlatList>) {
  const value = useObservable(() => interval(500).pipe(map(val => val * 3)))
  /**
   * State
   */
  const [markedRow, setMarkedRow] = useState()
  const [level, setLevel] = useState(0)
  const [ordering, setOrdering] = useState([1, 2, 3, 4, 5])
  const [markerPosition, setMarkerPosition] = useState(0)

  // FIXME position of animated rectangle
  // TODO get rectangle size from focused entry
  const refs = useRef(
    (() => ({
      translateX: new Animated.Value(0),
      translateY: new Animated.Value(0),
      lastOffset: { x: 0, y: 0 },
      lastTouchedItemIndex: null,
      targetItemIndex: null,
      rowHeights: {},
    }))()
  )

  const data = refs.current
  const getTargetRowIdx = (event: PanGestureHandlerGestureEvent['nativeEvent']) => {
    const currentPosition = event.absoluteY
    let targetIdx = 0
    const res = reduceWhile((acc) => acc<currentPosition, (acc, val) => {
      targetIdx += 1
      acc += data.rowHeights[val]
      return acc
    },0)(ordering)
    setMarkerPosition(res)
    data.targetItemIndex = targetIdx
  }

  const [itemLayoutCallback, [itemLayout]] = useEventCallback(
    event$ =>
      event$.pipe(
        map(([event, itemIndex]: [LayoutChangeEvent, OrgEntry]) => [
          event.nativeEvent.layout.height,
          itemIndex,
        ]),
        tap(([height, itemId]) => (refs.current.rowHeights[itemId] = height))
      ),
    []
  )

  const [panGestureListenerCallback, [event]] = useEventCallback(
    event$ =>
      event$.pipe(
        map((event: PanGestureHandlerGestureEvent) => [event.nativeEvent]),
        auditTime(100),
        tap(([ event ]) => {
          // Hover row
          console.tron.debug(getStateName(event.state))
          getTargetRowIdx(event)
        })
        /* tap(console.tron.debug) */
      ),
    []
  )

  const [panHandlerStateCallback, [panHandlerState]] = useEventCallback(
    event$ =>
      event$.pipe(
        map((ev: PanGestureHandlerStateChangeEvent) => ev.nativeEvent),
        tap(({ state, oldState, translationX, translationY }) => {
          if (oldState === State.ACTIVE) {
            data.lastOffset.x += translationX
            data.lastOffset.y += translationY
            data.translateX.setOffset(data.lastOffset.x)
            data.translateX.setValue(0)
            data.translateY.setOffset(data.lastOffset.y)
            data.translateY.setValue(0)
            const sourcePosition = data.lastTouchedItemIndex
            const newPosition = data.targetItemIndex - 1

            setOrdering([1,3,2,4,5])

          }

        }),
        map(({ oldState, state }) => [`${getStateName(oldState)} -> ${getStateName(state)}`])
        /* tap(console.tron.debug) */
      ),
    []
  )

  const getOffset = itemIdx => ordering.slice(0, itemIdx).reduce((acc, id) => {
      return acc + data.rowHeights[id]
    }, 0)


  /* const FlatListComponent = FlatList */
  const FlatListComponent = Outliner

  return (
    <View>
      <FlatListComponent
        renderItem={renderItemProps => (
          <TouchableOpacity
            onPressIn={ev => {
              // Select for touch
              // TODO in this layer only position should be id, there are no dict [id, id, id]
              const offset = getOffset(renderItemProps.index)
              data.lastOffset.y = offset
              data.translateY.setOffset(offset)
              data.translateY.setValue(0)
              data.lastTouchedItemIndex = renderItemProps.index
            }}
          >
            <View onLayout={event => itemLayoutCallback([event, renderItemProps.index])}>
              {renderItem(renderItemProps)}
            </View>
          </TouchableOpacity>
        )}
        {...props}
      />
      <Text>{value}</Text>
      <Text>{panHandlerState}</Text>
      <PanGestureHandler
        {...props}
        onGestureEvent={Animated.event(
          [
            {
              // TODO posinno słuchać stanu przejściowego
              nativeEvent: {
                translationX: data.translateX,
                translationY: data.translateY,
              },
            },
          ],
          {
            useNativeDriver: true,
            listener: panGestureListenerCallback,
          }
        )}
        onHandlerStateChange={panHandlerStateCallback}
      >
        <Animated.View
          style={[
            styles.box,
            { transform: [{ translateY: data.translateY }] },
            {
              height: data.rowHeights[data.lastTouchedItemIndex],
              backgroundColor: { 0: 'red', 1: 'yellow', 2: 'blue', 3: 'orange' }[level],
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
      <View
        style={{
          height: 2,
          width: 300,
          backgroundColor: 'green',
          position: 'absolute',
          top: markerPosition,
          zIndex: 300,
        }}
      ></View>
    </View>
  )
}

GesturesTwoDimentionsReorder.defaultProps = defaultProps

const getStateName = state =>
  Object.entries(State)
        .filter(el => el[1] === state)
        .map(el => el[0])


const Gestures = () => {
  const markedRow = 0
  return (
    <View>
      <GesturesTwoDimentionsReorder
        data={[1, 2, 3, 4, 5].map(id => ({ id }))}
        renderItem={({ item }) => (
          <View
            style={{
              borderBottomWidth: 2,
              height: 70,
            }}
          >
            <Text>id = {item.id} Row.</Text>
          </View>
        )}
      />
    </View>
  )
}


const styles = StyleSheet.create({
  box: {
    width: '100%',
    position: 'absolute',
    height: 50,
    /* alignSelf: 'center', */
    backgroundColor: 'plum',
    opacity: 0.5,
    /* margin: 10, */
    zIndex: 200,
  },
})

export default gestureHandlerRootHOC(Gestures)
