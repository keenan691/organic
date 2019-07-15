import { range, pipe, reduce, map, cond, all, equals, always, T } from 'ramda'
import { getLastDescendantPosition } from './selectors'
import { BooleanDict } from 'components/entry-list/types'

const setVisibility = (positions: number[], ordering: string[], visibility: BooleanDict) => (
  newState: boolean
) => {
  const changes = positions.reduce((acc, position) => {
    acc[ordering[position]] = newState
    return acc
  }, {})
  return {
    ...visibility,
    ...changes,
  }
}

export function cycleVisibility(
  itemPosition: number,
  ordering: string[],
  levels: number[],
  visibility: BooleanDict
) {
  const lastDescendantPosition = getLastDescendantPosition(levels, itemPosition)
  const descendantsPositions = range(itemPosition + 1, lastDescendantPosition + 1)

  if (descendantsPositions.length === 0) return visibility

  const childrenPositions = descendantsPositions.filter(
    position => levels[position] === levels[itemPosition] + 1
  )
  const mapToVisibilityArray = map((position: number) => visibility[ordering[position]])
  const allVisible = all(equals(true))
  const allHidden = all(equals(false))
  const setDescendantsVisibility = setVisibility(descendantsPositions, ordering, visibility)
  const setChildrenVisibility = setVisibility(childrenPositions, ordering, visibility)
  const hideDescendants = () => setDescendantsVisibility(false)
  const showDescendants = () => setDescendantsVisibility(true)
  const showFirstLevelDescendants = () => ({
    ...setDescendantsVisibility(false),
    ...setChildrenVisibility(true),
  })

  return pipe(
    mapToVisibilityArray,
    cond([
      [allVisible, hideDescendants],
      [allHidden, showFirstLevelDescendants],
      [T, showDescendants],
    ])
  )(descendantsPositions)
}
