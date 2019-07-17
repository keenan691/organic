import { range, pipe, map, cond, all, equals, T } from 'ramda'
import { getLastDescendantPosition } from './selectors'
import { BooleanDict } from 'components/entry-list/types'

export const hasHiddenChildren = (
  itemPosition: number,
  visibility: {},
  ordering: string[],
  levels: number[]
) => {
  let position = itemPosition
  do {
    position += 1
    if (!visibility[ordering[position]]) return true
  } while (levels[position] > levels[itemPosition])
  return false
}

const setVisibility = (positions: number[], ordering: string[], visibility: BooleanDict) => (
  visible: boolean
) => {
  const changes = positions.reduce((acc, position) => {
    acc[ordering[position]] = visible
    return acc
  }, {})
  return {
    ...visibility,
    ...changes,
  }
}

const modifyDetailsLevel = (direction: 'inc' | 'dec') => (
  ordering: string[],
  levels: number[],
  visibility: {}
) => {
  const visibleLevels = levels.filter((_, position) => visibility[ordering[position]])
  const maxLevel = Math.max(...visibleLevels)

  if (direction === 'dec' && maxLevel === 1) return visibility

  const isVisible = {
    dec: (level: number) => level < maxLevel,
    inc: (level: number) => level <= maxLevel + 1,
  }[direction]

  const newVisibillity = levels.reduce(
    (acc, level, position) => ({
      ...acc,
      [ordering[position]]: isVisible(level),
    }),
    {}
  )

  return newVisibillity
}

export const moreDetails = modifyDetailsLevel('inc')
export const lessDetails = modifyDetailsLevel('dec')

export function cycleItemVisibility(
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
