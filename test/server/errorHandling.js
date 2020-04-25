import { client } from './apolloClient'
import { gql } from 'apollo-boost'

import exception from './queries/exception'

const testQuery = (sql) => {
  const testFunc = async () => {
    const query = gql`${sql}`
    await expect(client.query({ query: query })).rejects.toThrow()
  }
  return testFunc
}

export const errorHandling = () => {
  for (const each of exception) {
    test(`simple: ${each.name}`, testQuery(each.sql))
  }
}
