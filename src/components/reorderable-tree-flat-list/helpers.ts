import { move } from 'ramda'
import { Refs } from './types'
import { getSourcePosition, getTargetPosition, getItemLevelOffset } from './selectors'
import { startShiftLevelAnimation } from './animations'

export const applyChanges = (
  data: Refs,
  ordering: string[],
  levels: number[]
): [string[], number[]] => {
  const fromPosition = getSourcePosition(data)
  const toPosition = getTargetPosition(data)
  const toLevel = data.move.toLevel

  const newOrdering = move(fromPosition, toPosition, ordering)
  const newLevels = move(fromPosition, toPosition, levels)

  newLevels[toPosition] = toLevel

  return [newOrdering, newLevels]
}

export function shiftDraggableLevel(
  data: Refs,
  ordering: string[],
  levels: number[],
  direction: 'left' | 'right'
) {
  const delta = direction === 'right' ? 1 : -1
  let newLevel = levels[data.move.toPosition - 1] + delta
  data.move.toLevel = newLevel
}
