import React, { useCallback, useEffect, useState, useLayoutEffect } from 'react'
import { Dimensions, LayoutChangeEvent, LayoutAnimation } from 'react-native'
import { startActivateAnimation, foldAnimation } from './animations'
import { AnimatedValues, Refs } from '.'
import { ItemData, Item } from './types'
import ItemDraggable from './ItemDraggable'
import rnTextSize, { TSFontSpecs } from 'react-native-text-size'
import { HEADLINE_FONT_SIZE, INDENT_SIZE, ITEM_PADDING_VERTICAL } from './constants'
import { pipe, reduce, reduceWhile, uniq } from 'ramda'
import { cycleItemVisibility, hasChildren, hasHiddenChildren } from './useVisibility'
import { createSelector } from 'reselect'
import { BooleanDict } from '../editor/types'

/**
 * Hook
 */

export function useItems(
  { levels, ordering, hideDict }: ItemData,
  data: Refs,
  draggableRef: React.MutableRefObject<ItemDraggable>,
  props,
  setVisibility: React.Dispatch<React.SetStateAction<{}>>,
  animatedValues: AnimatedValues,
  onChangeFocusedItem: ({ position: number, item: object }) => void
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
    return { length, offset, index }
  }

  const activateItem = useCallback((newPosition: number| string, newItem?: any) => {
    if (!draggableRef.current) return
    let position
    if (typeof newPosition === 'string'){
      const desiredId = newPosition
      position = ordering.findIndex((id) => id === desiredId)
      console.tron.debug('SDFSDF')
      console.tron.debug(position)
    } else {
      position = newItem ? newItem.position : newPosition
    }

    const level = newItem ? newItem.level : levels[position]
    const item = newItem ? newItem : props.itemDict[ordering[position]]
    // LayoutAnimation.configureNext(foldAnimation)
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
      onChangeFocusedItem({ position, item })
    }
  })

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

  const onItemPress = useCallback((item: Item) => {
    switch (item.type) {
      case 'workspace':
        data
        break;
      default:
    }

  },[])

  return {
    items,
    createNewItem,
    onItemIndicatorPress,
    onItemLayoutCallback,
    onItemPress,
    activateItem,
    getItemLayout,
    loadingItems: loading,
  }
}

/**
 * Helpers
 */

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

export const getItemLevelOffset = (level: number) => (level - 1) * INDENT_SIZE

export function getItemInfo(
  data: Refs,
  absoluteY: number,
  ordering: string[],
  hideDict: { [id: string]: boolean }
) {
  const { itemHeights, scrollPosition } = data
  let index = 0
  const offset = reduceWhile(
    currentOffset => currentOffset < absoluteY + scrollPosition,
    (currentOffset, itemId: string) => {
      index += 1
      if (!hideDict[itemId]) {
        currentOffset += itemHeights[index + 1]
      }
      return currentOffset
    },
    0
  )(ordering)
  return [index, offset - scrollPosition]
}

export const getAbsoluteItemPositionOffset = (
  position: number,
  ordering: string[],
  hideDict: BooleanDict,
  itemHeights: number[]
) =>
  ordering
    .slice(0, position)
    .reduce((acc, id) => (!hideDict[id] ? acc + itemHeights[position] : acc), 0)

export const getItems = createSelector(
  props => props.itemDict,
  props => props.ordering,
  (itemDict, ordering) => ordering.map(id => itemDict[id])
)

export function getDraggableToTargetOffset(
  data: Refs,
  ordering: string[],
  hideDict: { [itemId: string]: boolean }
) {
  return (
    getAbsoluteItemPositionOffset(getTargetPosition(data), ordering, hideDict, data.itemHeights) -
    data.lastOffset
  )
}

export const getSourcePosition = (data: Refs) => data.move.fromPosition

export function getTargetPosition(data: Refs) {
  return data.move.toPosition > getSourcePosition(data)
    ? data.move.toPosition - 1
    : data.move.toPosition
}

export function getLastDescendantPosition(levels: number[], sourcePosition: number) {
  let position = sourcePosition
  do {
    position += 1
  } while (levels[position] > levels[sourcePosition])
  return position - 1
}
