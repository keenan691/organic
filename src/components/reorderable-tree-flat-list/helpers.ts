import { NumberDict } from 'components/entry-list/types'
import { reduceWhile, move } from 'ramda'
import { ItemHeightCache } from './types'

export const getItemInfo = (
  absoluteY: number,
  scrollPosition: number,
  heights: ItemHeightCache,
  itemsOrder: number[]
) => {
  let index = 0
  const offset = reduceWhile(
    currentOffset => currentOffset < absoluteY + scrollPosition,
    (currentOffset, itemId) => {
      index += 1
      currentOffset += heights[itemId]
      return currentOffset
    },
    0
  )(itemsOrder)
  return [index, offset - scrollPosition]
}

/**
 * Computes offset for position. Doasn't take into account scroll position.
 */
export const getItemOffset = (position: number, ordering: string[], itemHeights: NumberDict) =>
  ordering.slice(0, position).reduce((acc, id) => {
    return acc + itemHeights[id]
  }, 0)

export const changeItemPosition = (
  position: number,
  newPosition: number,
  ordering: string[],
) => move(position, newPosition, ordering)
