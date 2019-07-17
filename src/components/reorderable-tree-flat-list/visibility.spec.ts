import { cycleItemVisibility, moreDetails, lessDetails } from './visibility'

const ordering = ['1', '2', '3', '4', '5']
const levels = [1, 2, 3, 1, 1]
const visibility = [true, true,true,true,true]
const cycleVisibility = (visibility, position) => cycleItemVisibility(position, ordering, levels, visibility)
const asDict = (array: boolean[]) => array.reduce((acc, el, idx) => ({
  ...acc,
  [ordering[idx]]: el
}), {})

it('should cycle subtree visibility', () => {
  let visibilityDict = asDict(visibility)
  visibilityDict = cycleVisibility(visibilityDict, 0)
  expect(visibilityDict).toEqual(asDict([true,false,false,true,true]))

  visibilityDict = cycleVisibility(visibilityDict, 0)
  expect(visibilityDict).toEqual(asDict([true,true,false,true,true]))

  visibilityDict = cycleVisibility(visibilityDict, 0)
  expect(visibilityDict).toEqual(asDict([true,true,true,true,true]))
})

it("should increase/decrease level of details", () => {
  let visibilityDict = asDict(visibility)
  visibilityDict = moreDetails(ordering, levels, visibilityDict);
  expect(visibilityDict).toEqual(asDict([true,true,true,true,true]))

  visibilityDict = lessDetails(ordering, levels, visibilityDict);
  expect(visibilityDict).toEqual(asDict([true,true, false,true,true]))

  visibilityDict = lessDetails(ordering, levels, visibilityDict);
  expect(visibilityDict).toEqual(asDict([true,false, false,true,true]))
})
