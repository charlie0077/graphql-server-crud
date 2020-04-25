import { asyncForEach } from '../src/utils'
import 'regenerator-runtime/runtime'

test('asyncForEach should run', async () => {
  let sum = 0
  const data = [1, 3, 4]
  await asyncForEach(data, async each => {
    sum += each
  })
  expect(sum).toBe(8)
})
