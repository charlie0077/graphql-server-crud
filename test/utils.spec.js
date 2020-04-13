import { isEmpty, asyncForEach } from '../src/utils'
import 'regenerator-runtime/runtime'

test('isEmpty should work', () => {
  expect(isEmpty(null)).toBe(true)
  expect(isEmpty(undefined)).toBe(true)
  expect(isEmpty({})).toBe(true)
  expect(isEmpty({ a: 1 })).toBe(false)
})

test('asyncForEach should run', async () => {
  let sum = 0
  const data = [1, 3, 4]
  await asyncForEach(data, async each => {
    sum += each
  })
  expect(sum).toBe(8)
})
