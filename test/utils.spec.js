import { isEmpty, asyncForEach, getSelectionFields } from '../src/utils'
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

test('getSelectionFields should work', () => {
  const selectionSet = {
    selections: [
      { name: { value: 'b' } },
      {
        name: { value: 'c' },
        selectionSet: {
          selections: [
            { name: { value: 'd' } },
            { name: { value: 'e' } }
          ]
        }
      }
    ]
  }

  const expected = {
    b: 'b',
    c: {
      d: 'd',
      e: 'e'
    }
  }

  expect(getSelectionFields(selectionSet)).toStrictEqual(expected)
})
