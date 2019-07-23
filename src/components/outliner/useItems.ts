import React, { useCallback, useState, useEffect } from 'react'
import { LayoutChangeEvent, Dimensions } from 'react-native'
import { getAbsoluteItemPositionOffset, getItemLevelOffset, getItems } from './selectors'
import { startActivateAnimation } from './animations'
import { cycleItemVisibility, hasHiddenChildren, hasChildren } from './visibility'
import { Refs, AnimatedValues } from '.'
import { ItemData } from './types'
import ItemDraggable from './item-draggable'
import { bufferCount, filter, distinctUntilChanged } from 'rxjs/operators'
import rnTextSize, { TSFontSpecs } from 'react-native-text-size'
import { INDENT_SIZE, HEADLINE_FONT_SIZE, ITEM_PADDING_VERTICAL } from './constants'
import { pipe, uniq, reduce } from 'ramda'

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
  return heights.map((height) => height + ITEM_PADDING_VERTICAL*2)
}

export const measureItems = async (texts: string[], levels: number[]) => {
  const positionsGroupedByLevel = texts.reduce((acc, _, idx) => {
    const level = levels[idx]
    acc[level].push(idx)
    return acc
  }, createEmptyLevelsDict(levels))

  const heights = Array(texts.length)
  const screenWidth = Dimensions.get('screen').width

  await Promise.all(Object.keys(positionsGroupedByLevel).map(async level => {
    const positions = positionsGroupedByLevel[level]
    const textsToMeasure = positions.map((position: number) => texts[position])
    const measureResult = await measure(textsToMeasure, parseInt(level), screenWidth)
    positions.forEach((position: number, idx: number) => {
      heights[position] = measureResult[idx]
    })
  }))

  return heights
}

export function useItems(
  { levels, ordering, hideDict }: ItemData,
  data: Refs,
  draggableRef: React.MutableRefObject<ItemDraggable>,
  props,
  setVisibility: React.Dispatch<React.SetStateAction<{}>>,
  animatedValues: AnimatedValues
) {
  const [loading, setLoading] = useState(true)

  useEffect(async () => {
    data.itemHeights = await measureItems(ordering.map(id => props.itemDict[id].headline), levels)
    setLoading(false)
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

  // TODO change to activateItem
  const onItemPress = (itemPosition: number) => {
    const itemLevel = levels[itemPosition]
    const absoluteItemOffset = getAbsoluteItemPositionOffset(
      itemPosition,
      ordering,
      hideDict,
      data.itemHeights
    )

    animatedValues.draggable.translateY.setOffset( absoluteItemOffset - data.scrollPosition )
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
      itemState: 'active',
      hasHiddenChildren:hasHiddenChildren(itemPosition, hideDict, ordering, levels),
      hasChildren:hasChildren(itemPosition, levels)
    })

    startActivateAnimation(animatedValues)
  }

  const editItem = () => {
    draggableRef.current.edit()
  }

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
    editItem,
    getItemLayout,
    loadingItems: loading
  }
}
