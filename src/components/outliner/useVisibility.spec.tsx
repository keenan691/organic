import {cycleItemVisibility, lessDetails, moreDetails} from "./useVisibility";

const ordering = ['1', '2', '3', '4', '5']
const levels = [1, 2, 3, 1, 1]
const hiddenPositions = [false, false, false, false, false]
const cycleVisibility = (hiddenPositions: { [position: string]: boolean }, position: number) =>
  cycleItemVisibility(position, ordering, levels, hiddenPositions)
const asDict = (array: boolean[]) =>
  array.reduce(
    (acc, el, idx) => ({
      ...acc,
      [ordering[idx]]: el,
    }),
    {}
  )

it('should cycle subtree hiddenPositions', () => {
  let hideDict = asDict(hiddenPositions)
  hideDict = cycleVisibility(hideDict, 0)
  expect(hideDict).toEqual(asDict([false, true, true, false, false]))

  hideDict = cycleVisibility(hideDict, 0)
  expect(hideDict).toEqual(asDict([false, false, true, false, false]))

  hideDict = cycleVisibility(hideDict, 0)
  expect(hideDict).toEqual(asDict([false, false, false, false, false]))
})

it('should increase/decrease level of details', () => {
  let hideDict = asDict(hiddenPositions)
  hideDict = moreDetails(ordering, levels, hideDict)
  expect(hideDict).toEqual(asDict([false, false, false, false, false]))

  hideDict = lessDetails(ordering, levels, hideDict)
  expect(hideDict).toEqual(asDict([false, false, true, false, false]))

  hideDict = lessDetails(ordering, levels, hideDict)
  expect(hideDict).toEqual(asDict([false, true, true, false, false]))
})
