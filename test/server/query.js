import { client } from './apolloClient'
import { gql } from 'apollo-boost'

export const query = () => {
  test('test simple query', async () => {
    const query = gql`
    query {
      getAuthor(id: 1) {
        id
        email
      }
    }
  `

    expect(await client.query({ query: query })).toMatchSnapshot()
  })

  test('test nested query all inner join', async () => {
    const query = gql`
    query {
      queryPost(
        where: { id: { gt: 1 } }
        offset: 0
        limit: 300
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

  test('test nested query all left join', async () => {
    const query = gql`
    query {
      queryPost(
        where: { id: { gt: 1 } }
        offset: 0
        limit: 300
        orderBy: { column: "id", order: "asc" }
      ) {
        id
        title
        author (joinType: "leftJoin") {
          email
          company (joinType: "leftJoin") {
            domain
          }
        }
      }
    }
  `

    expect(await client.query({ query: query })).toMatchSnapshot()
  })

  test('test nested query leftJoin and then join', async () => {
    const query = gql`
    query {
      queryPost(
        where: { id: { gt: 1 } }
        offset: 0
        limit: 300
        orderBy: { column: "id", order: "asc" }
      ) {
        id
        title
        author (joinType: "leftJoin") {
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

  test('test nested query left join and then left join', async () => {
    const query = gql`
    query {
      queryPost(
        where: { id: { gt: 1 } }
        offset: 0
        limit: 300
        orderBy: { column: "id", order: "asc" }
      ) {
        id
        title
        author (joinType: "leftJoin") {
          email
          company (joinType: "rightJoin") {
            domain
          }
        }
      }
    }
  `

    expect(await client.query({ query: query })).toMatchSnapshot()
  })

  test('test nested query with on clause', async () => {
    const query = gql`
      query {
        queryPost(
          where: { id: { gt: 1 } }
          offset: 0
          limit: 300
          orderBy: { column: "id", order: "asc" }
        ) {
          id
          title
          author (joinType: "leftJoin", on: {id: {gt: 3}}) {
            email
            id
            company(joinType: "leftJoin") {
              domain
            }
          }
        }
      }
    `

    expect(await client.query({ query: query })).toMatchSnapshot()
  })

  test('test multiple joins', async () => {
    const query = gql`
      query {
        queryAuthor(
          where: { id: { gt: 5 } }
          offset: 0
          limit: 10
          orderBy: { column: "id", order: "asc" }
        ) {
          id
          email
          post (joinType: "leftJoin", on: {id: {gt: 11}}) {
            title
            id
          }
          company(joinType: "leftJoin") {
            domain
            id
          }
          review(on: {star: {gt: 4}}){
            id
            star
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
          post_id: { gt: 2 }
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
              _or: [{ id: { eq: 1 } , last_name: { in: ["name2"] }}]
            }
            { first_name: { in: ["xx", "xx"] } }
          ],
          _and: [
            {
              email: { in: ["email2"] }
              last_name: { in: ["name3"] }
              _or: [{ id: { eq: 2 } , last_name: { in: ["name4"] }}]
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
        where: { id: { gt: 1 } }
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
        where: { id: { gt: 1 } }
        offset: 0
        limit: 3
        orderBy: { column: "id", order: "desc" }
      ) {
        id
        title
      },
      
      getAuthor(id: 1) {
        id
        email
      }
    }
  `

    expect(await client.query({ query: query })).toMatchSnapshot()
  })
}
