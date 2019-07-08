import { applyChanges } from './helpers'

const ordering = ['1', '2', '3', '4']

describe("Test changeItemPosition", () => {
  it('should move from first to last position', () => {
    const expected = ['2', '3', '4', '1']
    expect(applyChanges(0, 3, ordering)).toEqual(expected)
  })

  it('should move from last to first position', () => {
    const expected = ['4', '1', '2', '3']
    expect(applyChanges(3, 0, ordering)).toEqual(expected)
  })

  it('should move from second to thrid position', () => {
    const expected = ['1', '3', '2', '4']
    expect(applyChanges(1, 2, ordering)).toEqual(expected)
  })
})
