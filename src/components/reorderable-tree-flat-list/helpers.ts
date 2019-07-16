import { move, range } from 'ramda'
import { Refs } from './types'
import { getSourcePosition, getTargetPosition, getLastDescendantPosition } from './selectors'

export const getItemLayout = (data: any, index: number) => {
  /* const length = this.cache[data[index].id]; */
  const length = 50
  /* const offset = this.offsets[index]; */
  const offset = 50 * index
  return {
    length,
    offset,
    index,
  }
}

export function applyChanges(
  data: Refs,
  ordering: string[],
  levels: number[]
): [string[], number[]] {
  const sourcePosition = getSourcePosition(data)
  const targetPosition = getTargetPosition(data)

  const levelDelta = data.move.toLevel - levels[sourcePosition]
  const lastChildPosition = getLastDescendantPosition(levels, sourcePosition)

  const subtreeRange = range(sourcePosition, lastChildPosition+1)

  let newOrdering = ordering
  let newLevels =  levels

  if (sourcePosition > targetPosition) {

    subtreeRange.forEach((position: number, index: number) => {
      newOrdering = move(position , targetPosition + index, newOrdering)
      newLevels = move(position , targetPosition + index, newLevels)
      newLevels[targetPosition + index] += levelDelta
    })

  } else {

    subtreeRange.forEach((position: number, index: number) => {
      newOrdering = move(position - index, targetPosition, newOrdering)
      newLevels = move(position - index, targetPosition, newLevels)
      newLevels[targetPosition] += levelDelta
    })
  }
  return [newOrdering, newLevels]
}

export function shiftDraggableItemLevel(data: Refs, levels: number[], direction: 'left' | 'right') {
  const delta = direction === 'right' ? 1 : -1
  const currentItemLevel = data.move.toLevel
  const prevItemLevel = levels[data.move.toPosition - 1]
  const newLevel = currentItemLevel + delta
  if (newLevel > 0 && newLevel <= prevItemLevel + 1) {
    data.move.toLevel = newLevel
  }
}
