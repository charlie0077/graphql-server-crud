import { client } from './apolloClient'
import { gql } from 'apollo-boost'

import simple from './queries/simple'
import filter from './queries/filter'
import aggregation from './queries/aggregation'
import nested from './queries/nested'
import misc from './queries/misc'

const testQuery = (sql) => {
  const testFunc = async () => {
    const query = gql`${sql}`
    expect(await client.query({ query: query })).toMatchSnapshot()
  }
  return testFunc
}

export const query = () => {
  for (const each of simple) {
    test(`simple: ${each.name}`, testQuery(each.sql))
  }

  for (const each of filter) {
    test(`filter: ${each.name}`, testQuery(each.sql))
  }

  for (const each of aggregation) {
    test(`aggregation: ${each.name}`, testQuery(each.sql))
  }

  for (const each of nested) {
    test(`nested: ${each.name}`, testQuery(each.sql))
  }

  for (const each of misc) {
    test(`misc: ${each.name}`, testQuery(each.sql))
  }
}
