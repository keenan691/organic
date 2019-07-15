import { applyChanges } from './helpers'
import { getLastDescendantPosition } from './selectors';

const ordering = ['1', '2', '3', '4', '5']
const levels = [1, 2, 3, 1, 1]

describe("getLastChildPosition", () => {
  it("should return last element of the first subtree", () => {
    expect(getLastDescendantPosition(levels, 0)).toEqual(2)
  })
})

it("should move item without children to the last position", () => {
  const expected = [
    ['1', '2', '3', '5', '4'],
    [1, 2, 3, 1, 1]
  ]
  expect(applyChanges({move: {
    fromPosition: 3,
    toPosition: 5,
    toLevel: 1
  }}, ordering, levels)).toEqual(expected)
})

it("should move item without children to the last position", () => {
  const expected = [
    ['1', '2', '3', '5', '4'],
    [1, 2, 3, 1, 1]
  ]
  expect(applyChanges({move: {
    fromPosition: 4,
    toPosition: 3,
    toLevel: 1
  }}, ordering, levels)).toEqual(expected)
})

it("should move subtree to the last position", () => {
  const ordering = ['1', '2', '3', '4', '5']
  const levels = [1, 2, 3, 1, 1]
  const expected = [
    ['4', '5', '1', '2', '3'],
    [1, 1, 1, 2, 3]
  ]
  expect(applyChanges({move: {
    fromPosition: 0,
    toPosition: 5,
    toLevel: 1
  }}, ordering, levels)).toEqual(expected)
})

it("should move subtree up", () => {
  const levels = [1, 1, 1, 2, 3]
  const expected = [
    ['3', '4', '5', '1', '2'],
    [1, 2, 3, 1, 1]
  ]
  expect(applyChanges({move: {
    fromPosition: 2,
    toPosition: 0,
    toLevel: 1
  }}, ordering, levels)).toEqual(expected)
})
