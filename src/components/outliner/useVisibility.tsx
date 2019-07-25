import { useState, useLayoutEffect } from 'react'
import { BooleanDict } from '../entry-list/types'
import { all, equals, map, pipe, range, T, cond } from 'ramda'
import {getLastDescendantPosition} from "./useItems";
import { foldAnimation } from './animations';
import { LayoutAnimation } from 'react-native';

export function useVisibility(ordering: string[]): [any, any] {
  const [hideDict, setItemVisibility] = useState(() => ordering.reduce((acc, id) => ({ ...acc, [id]: false }), {}))

  useLayoutEffect(() => {
    LayoutAnimation.configureNext(foldAnimation)
  }, [hideDict])

  return [hideDict, setItemVisibility]

}

export const hasChildren = (itemPosition: number, levels: number[]) => {
  const itemLevel = levels[itemPosition]
  return itemPosition < levels.length && levels[itemPosition + 1] > itemLevel
}

export const hasHiddenChildren = (
  itemPosition: number,
  hiddenDict: {},
  ordering: string[],
  levels: number[]
) => {
  const childLevel = levels[itemPosition] + 1
  let position = itemPosition
  do {
    position += 1
    if (levels[position] === childLevel && hiddenDict[ordering[position]]) {
      return true
    }
  } while (levels[position] > levels[itemPosition])
  return false
}

const setNonVisibility = (positions: number[], ordering: string[], hiddenDict: BooleanDict) => (
  visible: boolean
) => {
  const changes = positions.reduce((acc, position) => {
    acc[ordering[position]] = visible
    return acc
  }, {})
  return {
    ...hiddenDict,
    ...changes,
  }
}
const modifyDetailsLevel = (direction: 'inc' | 'dec') => (
  ordering: string[],
  levels: number[],
  hiddenDict: {}
) => {
  const visibleLevels = levels.filter((_, position) => !hiddenDict[ordering[position]])
  const maxLevel = Math.max(...visibleLevels)

  if (direction === 'dec' && maxLevel === 1) {
    return hiddenDict
  }

  const isVisible = {
    dec: (level: number) => level < maxLevel,
    inc: (level: number) => level <= maxLevel + 1,
  }[direction]

  const newVisibillity = levels.reduce(
    (acc, level, position) => ({
      ...acc,
      [ordering[position]]: !isVisible(level),
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
  hiddenDict: BooleanDict
) {
  const lastDescendantPosition = getLastDescendantPosition(levels, itemPosition)
  const descendantsPositions = range(itemPosition + 1, lastDescendantPosition + 1)

  if (descendantsPositions.length === 0) {
    return hiddenDict
  }

  const childrenPositions = descendantsPositions.filter(
    position => levels[position] === levels[itemPosition] + 1
  )
  const mapToVisibilityArray = map((position: number) => hiddenDict[ordering[position]])
  const allVisible = all(equals(false))
  const allHidden = all(equals(true))
  const setDescendantsNonVisibility = setNonVisibility(descendantsPositions, ordering, hiddenDict)
  const setChildrenNonVisibility = setNonVisibility(childrenPositions, ordering, hiddenDict)
  const hideDescendants = () => setDescendantsNonVisibility(true)
  const showDescendants = () => setDescendantsNonVisibility(false)
  const showFirstLevelDescendants = () => ({
    ...setDescendantsNonVisibility(true),
    ...setChildrenNonVisibility(false),
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
