import 'regenerator-runtime/runtime'
import { addResolvers } from '../src/resolvers.js'

class Model1 {
  fields = {
    id: 'String',
    point: 'Float'
  }

  queryToGenerate = ['GET', 'LIST', 'FETCH', 'UPDATE']
}

class Model2 {
  fields = {
    id: 'String',
    name: 'String'
  }

  queryToGenerate = ['GET', 'LIST']
}

const models = [Model1, Model2]

test('should add resolvers', () => {
  const resolvers = [1]
  addResolvers(resolvers, models)
  expect(resolvers.length).toBe(3)
})
