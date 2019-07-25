import { getLastDescendantPosition, getSourcePosition, getTargetPosition } from './useItems'
import { range, move } from 'ramda'
import { Refs } from './index'

export function applyChanges(
  data: Refs,
  ordering: string[],
  levels: number[]
): [string[], number[]] {

  const sourcePosition = getSourcePosition(data)
  const targetPosition = getTargetPosition(data)
  const { toLevel } = data.move

  if (!sourcePosition || !targetPosition || !toLevel) {
    throw new TypeError()
  }

  const levelDelta = toLevel - levels[sourcePosition]
  const lastChildPosition = getLastDescendantPosition(levels, sourcePosition)
  const subtreeRange = range(sourcePosition, lastChildPosition + 1)

  let newOrdering = ordering
  let newLevels = levels

  if (sourcePosition > targetPosition) {
    subtreeRange.forEach((position: number, index: number) => {
      newOrdering = move(position, targetPosition + index, newOrdering)
      newLevels = move(position, targetPosition + index, newLevels)
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
