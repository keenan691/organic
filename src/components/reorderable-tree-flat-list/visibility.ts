import { range } from 'ramda'
import { getLastChildPosition } from './selectors'
import { BooleanDict } from 'components/entry-list/types'

function hideItems(positionsToHide: number[], ordering: string[], visibility: BooleanDict) {
  const newVisibility = { ...visibility }
  positionsToHide.forEach(position => (newVisibility[ordering[position]] = false))
  return newVisibility
}

export function cycleSubtreeVisibility(
  itemPosition: number,
  ordering: string[],
  levels: number[],
  visibility: BooleanDict
) {
  const lastChildPosition = getLastChildPosition(levels, itemPosition)
  const subtreeRange = range(itemPosition, lastChildPosition + 1)

  if (subtreeRange.length > 1) {
    return hideItems(subtreeRange.slice(1), ordering, visibility)
  }

  return visibility
}
