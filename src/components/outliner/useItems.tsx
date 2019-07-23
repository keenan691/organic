import React, { useCallback, useState } from 'react'
import { LayoutChangeEvent } from 'react-native'
import { getAbsoluteItemPositionOffset, getItemLevelOffset, getItems } from './selectors'
import { startActivateAnimation } from './animations'
import { cycleItemVisibility } from './visibility'
import { Refs, AnimatedValues } from '.'
import { ItemData } from './types';
import ItemDraggable from './item-draggable';
import { Subject } from 'rxjs';
import { bufferCount, filter, distinctUntilChanged } from 'rxjs/operators';
import { useObservable } from 'rxjs-hooks';

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

  // TODO change to activateItem
  const onItemPress =  (itemPosition ) => {
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

      draggableRef.current.setState({
        item: props.itemDict[ordering[itemPosition]],
        level: itemLevel,
        position: itemPosition,
        itemState: 'active'
      })

      startActivateAnimation(animatedValues)
    }

  const editItem = () => {
    draggableRef.current.edit()
  }


  const onItemPressc = useCallback(
    (itemPosition) => {
      const itemLevel = levels[itemPosition]
      const item = props.itemDict[ordering[itemPosition]]
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

      switch (data.draggable.state) {
        case 'active':
          draggableRef.current.setState({
            item,
            level: item.level,
            position: itemPosition,
          })
          draggableRef.current.edit()
          data.draggable.state = 'inactive'
          break;
        case 'inactive':
          draggableRef.current.focus({
            item: props.itemDict[ordering[itemPosition]],
            level: itemLevel,
            position: itemPosition,
          })
          data.draggable.state = 'active'
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
    editItem
  }
}
