import { move, range } from 'ramda'
import { Refs } from './types'
import { getSourcePosition, getTargetPosition, getItemLevelOffset } from './selectors'
import { startShiftLevelAnimation } from './animations'

export function getLastChildPosition(levels: number[], sourcePosition: number) {
  let position = sourcePosition
  do {
    position += 1
  } while (levels[position] > levels[sourcePosition])
  return position - 1
}

export function applyChanges(
  data: Refs,
  ordering: string[],
  levels: number[]
): [string[], number[]] {
  const sourcePosition = getSourcePosition(data)
  const targetPosition = getTargetPosition(data)

  const levelDelta = data.move.toLevel - levels[sourcePosition]
  const lastChildPosition = getLastChildPosition(levels, sourcePosition)

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
