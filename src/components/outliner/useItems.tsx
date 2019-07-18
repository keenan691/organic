import React, { useCallback } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { getAbsoluteItemPositionOffset, getItemLevelOffset, getItems } from './selectors'
import { startActivateAnimation } from './animations'
import { cycleItemVisibility } from './visibility'
import { Refs, AnimatedValues } from '.'
import { ItemData } from './types';
import ItemDraggable from './item-draggable';

export function useItems(
  { levels, ordering, hideDict }: ItemData,
  data: Refs,
  draggableRef: React.MutableRefObject<ItemDraggable>,
  props,
  setVisibility: React.Dispatch<React.SetStateAction<{}>>,
  animatedValues: AnimatedValues
) {

  const onItemLayoutCallback = useCallback((event: LayoutChangeEvent, itemId:  string) => {
    data.itemHeights[itemId] = event.nativeEvent.layout.height
  }, [])

  const onItemPress = useCallback(
    (itemPosition, item) => {
      const itemLevel = levels[itemPosition]
      const absoluteItemOffset = getAbsoluteItemPositionOffset(
        itemPosition,
        ordering,
        hideDict,
        data.itemHeights
      )

      animatedValues.draggable.translateY.setOffset(absoluteItemOffset - data.scrollPosition)
      animatedValues.draggable.translateY.setValue(0)
      animatedValues.draggable.level.setValue(getItemLevelOffset(itemLevel))

      data.move.fromPosition = itemPosition
      data.move.toPosition = itemPosition
      data.move.toLevel = itemLevel

      data.draggable.levelOffset = 0
      data.lastOffset = absoluteItemOffset

      const action = item ? 'EDIT_ITEM' : 'FOCUS_ITEM'

      switch (action) {
        case 'EDIT_ITEM':
          draggableRef.current.setNativeProps({
            item,
            level: item.level,
            position: itemPosition,
          })
          draggableRef.current.edit()
          break;
        case 'FOCUS_ITEM':
          draggableRef.current.setNativeProps({
            item: props.itemDict[ordering[itemPosition]],
            level: itemLevel,
            position: itemPosition,
          })
          startActivateAnimation(animatedValues)
          break
      }
    },
    [ordering, levels, hideDict]
  )

  const createNewItem = useCallback(
    (placement: 'top' | 'bottom') => {
      const position = data.move.fromPosition
      if (!position) throw new TypeError('position is not set')

      const level = levels[position]
      const item = {
        position,
        level,
        headline: '',
        tags: [],
      }
      onItemPress(position, item)
      setTimeout(() => {
        props.addItem(item)
      }, 50)
    },
    [levels, ordering]
  )

  const items = getItems(props)

  const onItemIndicatorPress = useCallback(
    position => setVisibility(cycleItemVisibility(position, ordering, levels, hideDict)),
    [ordering, levels, hideDict]
  )

  return {
    items,
    createNewItem,
    onItemIndicatorPress,
    onItemLayoutCallback,
    onItemPress,
  }
}
