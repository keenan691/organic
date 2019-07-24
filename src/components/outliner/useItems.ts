import React, { useCallback, useState, useEffect } from 'react'
import { LayoutChangeEvent, Dimensions, LayoutAnimation } from 'react-native'
import { getAbsoluteItemPositionOffset, getItemLevelOffset, getItems } from './selectors'
import { startActivateAnimation, foldAnimation } from './animations'
import { cycleItemVisibility, hasHiddenChildren, hasChildren } from './visibility'
import { Refs, AnimatedValues } from '.'
import { ItemData } from './types'
import ItemDraggable from './item-draggable'
import { bufferCount, filter, distinctUntilChanged } from 'rxjs/operators'
import rnTextSize, { TSFontSpecs } from 'react-native-text-size'
import { INDENT_SIZE, HEADLINE_FONT_SIZE, ITEM_PADDING_VERTICAL } from './constants'
import { pipe, uniq, reduce, insert } from 'ramda'

const headlineFontSpecs: TSFontSpecs = {
  fontFamily: undefined,
  fontSize: HEADLINE_FONT_SIZE,
}

const createEmptyLevelsDict = pipe(
  uniq,
  reduce((acc, level: number) => ({ ...acc, [level]: [] }), {})
)

const measure = async (texts: string[], level: number, screenWidth: number) => {
  const width = screenWidth - INDENT_SIZE * (level - 1)
  const heights = await rnTextSize.flatHeights({
    text: texts,
    width,
    ...headlineFontSpecs,
  })
  return heights.map(height => height + ITEM_PADDING_VERTICAL * 2)
}

export const measureItems = async (texts: string[], levels: number[]) => {
  const heights = Array(texts.length)
  const screenWidth = Dimensions.get('screen').width

  const positionsGroupedByLevel = texts.reduce((acc, _, idx) => {
    const level = levels[idx]
    acc[level].push(idx)
    return acc
  }, createEmptyLevelsDict(levels))

  await Promise.all(
    Object.keys(positionsGroupedByLevel).map(async level => {
      const positions = positionsGroupedByLevel[level]
      const textsToMeasure = positions.map((position: number) => texts[position])
      const measureResult = await measure(textsToMeasure, parseInt(level), screenWidth)
      positions.forEach((position: number, idx: number) => {
        heights[position] = measureResult[idx]
      })
    })
  )

  return heights
}

export function useItems(
  { levels, ordering, hideDict }: ItemData,
  data: Refs,
  draggableRef: React.MutableRefObject<ItemDraggable>,
  props,
  setVisibility: React.Dispatch<React.SetStateAction<{}>>,
  animatedValues: AnimatedValues,
  focusItem: (index: number) => void
) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    measureItems(ordering.map(id => props.itemDict[id].headline), levels).then(heights => {
      data.itemHeights = heights
      setLoading(false)
    })
  }, [])

  const onItemLayoutCallback = useCallback((event: LayoutChangeEvent, itemId: string) => {
    // TODO
    // data.itemHeights[itemId] = event.nativeEvent.layout.height
  }, [])

  const getItemLayout = (_, index: number) => {
    const ITEM_HEIGHT = data.itemHeights[index]
    const length = ITEM_HEIGHT
    const offset = ITEM_HEIGHT * index
    return {
      length,
      offset,
      index,
    }
  }

  const activateItem = (newPosition: number, newItem?: any) => {
    const position = newItem ? newItem.position : newPosition
    const level = newItem ? newItem.level : levels[position]
    const item = newItem ? newItem : props.itemDict[ordering[position]]

    const absoluteItemOffset = getAbsoluteItemPositionOffset(
      position,
      ordering,
      hideDict,
      data.itemHeights
    )

    animatedValues.draggable.translateY.setOffset(absoluteItemOffset)
    animatedValues.draggable.translateY.setValue(0)
    animatedValues.draggable.level.setValue(getItemLevelOffset(level))

    data.move.fromPosition = position
    data.move.toPosition = position
    data.move.toLevel = level

    data.draggable.levelOffset = 0
    data.lastOffset = absoluteItemOffset

    if (newItem) {
      draggableRef.current.setState({
        item,
        level,
        itemState: 'edit',
      })
      // focusItem(position)
    } else {
      draggableRef.current.setState({
        item,
        level,
        position,
        itemState: 'dragged',
        hasHiddenChildren: hasHiddenChildren(position, hideDict, ordering, levels),
        hasChildren: hasChildren(position, levels),
      })

      draggableRef.current.activate()

      startActivateAnimation(animatedValues)
    }
  }

  const createNewItem = useCallback(
    (direction: 'top' | 'bottom') => {
      const focusedItemPosition = data.move.fromPosition
      if (!focusedItemPosition) throw new TypeError('position is not set')

      const positionDelta = direction === 'top' ? 0 : 1
      const newItemPosition = focusedItemPosition + positionDelta

      const level = levels[focusedItemPosition]
      // TODO real id
      const id = 'newIdsdfsdf' + Math.random()
      const item = {
        id,
        level,
        headline: '',
        position: newItemPosition,
        tags: [],
      }
      activateItem(null, item)
      setTimeout(() => {
        // const emptyItemHeight = ITEM_PADDING_VERTICAL * 2 + HEADLINE_FONT_SIZE
        // TODO add real height
        const emptyItemHeight = 51.14285659790039
        data.itemHeights.splice(newItemPosition, 0, emptyItemHeight)
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
    activateItem,
    getItemLayout,
    loadingItems: loading,
  }
}
