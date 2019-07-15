import { cycleVisibility } from './visibility'

const ordering = ['1', '2', '3', '4', '5']
const levels = [1, 2, 3, 1, 1]
const visibility = [true, true,true,true,true]
const cycle = (visibility, position) => cycleVisibility(position, ordering, levels, visibility)
const asDict = (array: boolean[]) => array.reduce((acc, el, idx) => ({
  ...acc,
  [ordering[idx]]: el
}), {})

it('should cycle subtree visibility', () => {
  let visibilityDict = asDict(visibility)
  visibilityDict = cycle(visibilityDict, 0)
  expect(visibilityDict).toEqual(asDict([true,false,false,true,true]))
  visibilityDict = cycle(visibilityDict, 0)
  expect(visibilityDict).toEqual(asDict([true,true,false,true,true]))
  visibilityDict = cycle(visibilityDict, 0)
  expect(visibilityDict).toEqual(asDict([true,true,true,true,true]))
})
