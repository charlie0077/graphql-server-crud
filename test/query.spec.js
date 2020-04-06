import ApolloClient, { gql } from 'apollo-boost'
import 'cross-fetch/polyfill'

export const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  onError: (e) => { console.log(e) }
})

test('test simple query', async () => {
  const query = gql`
    query {
      getAuthor(id: "1") {
        id
        email
      }
    }
  `

  expect(await client.query({ query: query })).toMatchSnapshot()
})

test('test nested query', async () => {
  const query = gql`
    query {
      queryPost(
        where: { id: { gt: "1" } }
        offset: 0
        limit: 3
        orderBy: { column: "id", order: "asc" }
      ) {
        id
        title
        author {
          email
          company {
            domain
          }
        }
      }
    }
  `

  expect(await client.query({ query: query })).toMatchSnapshot()
})

test('test aggregation', async () => {
  const query = gql`
    query {
      queryAuthorJoinPost(
        where: {
          post_id: { gt: "2" }
        }
        orderBy: [{ column: "id", order: "asc" }]
        limit: 10
        offset: 0
        groupBy: ["id", "email"]
        having: {
          age__avg: {gt: 30}
        }
      ) {
        id
        email
        age__avg
      }
    }
  `

  expect(await client.query({ query: query })).toMatchSnapshot()
})

test('test complicate search', async () => {
  const query = gql`
    query {
      queryAuthor(
        where: {
          _or: [
            {
              email: { in: ["email1"] }
              last_name: { in: ["name1"] }
              _or: [{ id: { eq: "1" } , last_name: { in: ["name2"] }}]
            }
            { first_name: { in: ["xx", "xx"] } }
          ],
          _and: [
            {
              email: { in: ["email2"] }
              last_name: { in: ["name3"] }
              _or: [{ id: { eq: "2" } , last_name: { in: ["name4"] }}]
            }
            { first_name: { in: ["name5", "name6"] } }
          ]
        }
      ) {
        id
        email
        first_name
        last_name
      }
    }
  `

  expect(await client.query({ query: query })).toMatchSnapshot()
})

test('test limit and offset', async () => {
  const query = gql`
    query {
      queryPost(
        offset: 0
        limit: 3
      ) {
        id
        title
      }
    }
  `

  expect(await client.query({ query: query })).toMatchSnapshot()
})

test('test sort', async () => {
  const query = gql`
    query {
      queryPost(
        where: { id: { gt: "1" } }
        offset: 0
        limit: 3
        orderBy: { column: "id", order: "desc" }
      ) {
        id
        title
      }
    }
  `

  expect(await client.query({ query: query })).toMatchSnapshot()
})

test('test multiple queries in a request', async () => {
  const query = gql`
    query {
      queryPost(
        where: { id: { gt: "1" } }
        offset: 0
        limit: 3
        orderBy: { column: "id", order: "desc" }
      ) {
        id
        title
      },
      
      getAuthor(id: "1") {
        id
        email
      }
    }
  `

  expect(await client.query({ query: query })).toMatchSnapshot()
})
