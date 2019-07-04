import { changeItemPosition } from './helpers'

const ordering = ['1', '2', '3', '4']

it('should move from first to last position', () => {
  const inputArgs = [0, 3, ordering]
  const output = ['2', '3', '4', '1']
  expect(changeItemPosition(...inputArgs)).toEqual(output)
})

it('should move from last to first position', () => {
  const inputArgs = [3, 0, ordering]
  const output = ['4', '1', '2', '3']
  expect(changeItemPosition(...inputArgs)).toEqual(output)
})

it('should move from second to thrid position', () => {
  const inputArgs = [1, 2, ordering]
  const output = ['1', '3', '2', '4']
  expect(changeItemPosition(...inputArgs)).toEqual(output)
})
