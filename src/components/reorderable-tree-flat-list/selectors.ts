import { NumberDict } from 'components/entry-list/types'
import { reduceWhile, move } from 'ramda'
import { ItemHeightCache, Refs } from './types'
import { INDENT_SIZE } from './constants'
import { createSelector } from 'reselect';

export const getItemLevelOffset = (level: number) => (level - 1) * INDENT_SIZE

export function getItemInfo(
  data: Refs,
  absoluteY: number,
  itemsOrder: number[]
) {
  const { itemHeights, scrollPosition } = data
  let index = 0
  const offset = reduceWhile(
    currentOffset => currentOffset < absoluteY + scrollPosition,
    (currentOffset, itemId) => {
      index += 1
      currentOffset += itemHeights[itemId]
      return currentOffset
    },
    0
  )(itemsOrder)
  return [index, offset - scrollPosition]
}

export const getAbsoluteItemPositionOffset = (
  position: number,
  ordering: string[],
  itemHeights: NumberDict
) =>
  ordering.slice(0, position).reduce((acc, id) => {
    return acc + itemHeights[id]
  }, 0)

export const getItems = createSelector(
  props => props.itemDict,
  props => props.ordering,
  (itemDict, ordering) => ordering.map(id => itemDict[id])
)

export function getDraggableToTargetOffset(data: Refs, ordering: string[]) {
  return (
    getAbsoluteItemPositionOffset(getTargetPosition(data), ordering, data.itemHeights) -
    data.lastOffset
  )
}

export const getSourcePosition = (data: Refs) => data.move.fromPosition

export function getTargetPosition(data: Refs) {
  return data.move.toPosition > getSourcePosition(data)
                              ? data.move.toPosition - 1
                              : data.move.toPosition
}
