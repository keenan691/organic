import React, { useRef, useState, useLayoutEffect } from 'react'
import { View, Animated, LayoutAnimation, Text } from 'react-native'
import {
  FlatList,
  PanGestureHandler,
  PinchGestureHandler,
  gestureHandlerRootHOC,
} from 'react-native-gesture-handler'

import styles from './styles'
import { useMeasure } from 'helpers/hooks'
import { foldAnimation } from './animations'
import ItemDraggable from './item-draggable'
import Item from './item'
import { useItems } from './useItems'
import { usePinchGesture } from './usePinchGesture'
import { useScroll } from './useScroll'
import { usePanGesture } from './usePanGesture'

type Props = {
  addItem: (item: object) => void
  deleteItems: (positions:  number[]) => void
  itemDict: object
  levels: number[]
  ordering: string[]
  setLevels: (levels: number[]) => void
  setOrdering: (ordering: string[]) => void
} & typeof defaultProps &
  React.ComponentProps<typeof FlatList>

const defaultProps = {}

const createAnimatedValues = () => ({
  draggable: {
    level: new Animated.Value(0),
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(0),
  },
  targetIndicator: {
    opacity: new Animated.Value(0.2),
    translateY: new Animated.Value(0),
  },
  scroll: new Animated.Value(0),
})

const gestureData = {
  itemHeights: [] as number[],
  panGesture: {
    x: 0,
    y: 0,
  },
  pinchGesture: {
    isActive: false,
  },
  lastOffset: 0,
  draggable: {
    levelOffset: 0,
    state: 'inactive' as 'inactive' | 'active' | 'edit',
  },
  moveAxis: 'h',
  move: {
    fromPosition: null as number | null,
    toLevel: null as number | null,
    toPosition: null,
  },
  scrollPosition: 0,
  animating: false,
}

function Outliner({ renderItem, ...props }: Props) {
  const bench = useMeasure('ReorderableTree')

  const { ordering, setOrdering, levels, setLevels } = props
  const refs = useRef(gestureData)
  const animatedValuesRef = useRef(createAnimatedValues())
  const animatedValues = animatedValuesRef.current
  const refsData = refs.current

  const draggableItemRef = useRef<ItemDraggable>()

  const flatlistRef = useRef<FlatList<{}>>()
  const focusItem = (index: number) => {
    flatlistRef.current.getNode().scrollToIndex({
      index,
      viewPosition: 0.2,
    })
  }

  const [hideDict, setItemVisibility] = useState(() =>
    ordering.reduce((acc, id) => ({ ...acc, [id]: false }), {})
  )

  const itemsData = { hideDict, levels, ordering }

  const {
    items,
    createNewItem,
    onItemIndicatorPress,
    onItemLayoutCallback,
    activateItem,
    getItemLayout,
    loadingItems,
  } = useItems(
    itemsData,
    refsData,
    draggableItemRef,
    props,
    setItemVisibility,
    animatedValues,
    focusItem
  )

  const { onPanCallback, onPanHandlerStateCallback } = usePanGesture(
    itemsData,
    refsData,
    draggableItemRef,
    setOrdering,
    setLevels,
    animatedValues
  )

  const { onPinchCallback, onPinchStateCallback } = usePinchGesture(
    itemsData,
    refsData,
    setItemVisibility
  )

  const onScrollEventCallback = useScroll(refsData, animatedValues)

  useLayoutEffect(() => {
    LayoutAnimation.configureNext(foldAnimation)
  }, [hideDict])

  if (loadingItems) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    )
  }
  bench.step('reorderable')
  return (
    <ReorderableTreeFlatListContext.Provider value={refs}>
      <PinchGestureHandler
        onGestureEvent={onPinchCallback}
        onHandlerStateChange={onPinchStateCallback}
      >
        <View>
          <Animated.FlatList
            renderItem={({ item, index }) => (
              <Item
                item={item}
                position={index}
                onItemPress={activateItem}
                onItemIndicatorPress={onItemIndicatorPress}
                onItemLayoutCallback={onItemLayoutCallback}
                itemHeight={refsData.itemHeights[index]}
                renderItem={renderItem}
                {...itemsData}
              />
            )}
            ref={flatlistRef}
            data={items}
            getItemLayout={getItemLayout}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: animatedValues.scroll } } }],
              { useNativeDriver: true, listener: onScrollEventCallback }
            )}
            {...props}
          />

          <PanGestureHandler
            onGestureEvent={Animated.event(
              [{ nativeEvent: { translationY: animatedValues.draggable.translateY } }],
              {
                useNativeDriver: true,
                listener: event => {
                  onPanCallback(event)
                },
              }
            )}
            onHandlerStateChange={onPanHandlerStateCallback}
          >
            <Animated.View
              style={[
                styles.draggable,
                {
                  opacity: animatedValues.draggable.opacity,
                  transform: [
                    {
                      translateY: Animated.add(
                        animatedValues.draggable.translateY,
                        Animated.divide(animatedValues.scroll, -1)
                      ),
                    },
                  ],
                },
              ]}
            >
              <Animated.View
                style={[
                  styles.row,
                  { transform: [{ translateX: animatedValues.draggable.level }] },
                ]}
              >
                <ItemDraggable
                  onAddButtonPress={createNewItem}
                  onItemPress={activateItem}
                  onItemIndicatorPress={onItemIndicatorPress}
                  renderItem={renderItem}
                  ref={draggableItemRef}
                  focus={focusItem}
                  activateItem={activateItem}
                  deleteItems={props.deleteItems}
                  changeItems={props.changeItems}
                  refs={refs}
                  {...itemsData}
                />
              </Animated.View>
            </Animated.View>
          </PanGestureHandler>

          <Animated.View
            style={[
              styles.targetIndicator,
              { opacity: animatedValues.targetIndicator.opacity },
              { transform: [{ translateY: animatedValues.targetIndicator.translateY }] },
            ]}
          />
        </View>
      </PinchGestureHandler>
    </ReorderableTreeFlatListContext.Provider>
  )
}

Outliner.defaultProps = defaultProps

export type Refs = typeof gestureData
export type AnimatedValues = ReturnType<typeof createAnimatedValues>
export const ReorderableTreeFlatListContext = React.createContext<Context>({})

export default gestureHandlerRootHOC(Outliner)
