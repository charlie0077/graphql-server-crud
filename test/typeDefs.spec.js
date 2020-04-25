import 'regenerator-runtime/runtime'
import { addTypeDefs } from '../src'

class Model1 {
  fields = {
    id: 'String',
    point: 'Float'
  }

  queryToGenerate = ['GET', 'LIST', 'UPDATE', 'DELETE']
}

class Model2 {
  fields = {
    id: 'String',
    name: 'String'
  }

  queryToGenerate = ['GET', 'LIST']
}

const models = [Model1, Model2]

test('should add typeDefs', () => {
  const typeDefs = [1]
  addTypeDefs(typeDefs, models)
  expect(typeDefs.length).toBe(7)
})
