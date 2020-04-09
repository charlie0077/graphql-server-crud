import { client } from './apolloClient'
import { gql } from 'apollo-boost'

export const mutation = () => {
  test('test insert', async () => {
    const mutation = gql`
    mutation {
      insertPost (data: {id: "1111", title: "new post 1111"}) {
        id
        title
      }
    }
  `

    expect(await client.mutate({ mutation: mutation })).toMatchSnapshot()
  })

  test('test bulk insert', async () => {
    const mutation = gql`
    mutation {
      bulkInsertPost(
        data: [
          { id: "2222", title: "new post 2222"}
          { id: "3333", title: "new post 3333"}
        ]
      ) {
        id
        title
      }
    }
  `

    expect(await client.mutate({ mutation: mutation })).toMatchSnapshot()
  })

  test('test update', async () => {
    const mutation = gql`
    mutation {
      updatePost(data: { id: "1", title: "new post 1"}) {
        id
        title
      }
    }
  `

    expect(await client.mutate({ mutation: mutation })).toMatchSnapshot()
  })

  test('test bulk update', async () => {
    const mutation = gql`
    mutation {
      bulkUpdatePost(
        data: [
          { id: "1", title: "new post 1111" }
          { id: "2", title: "new post 2222" }
        ]
      ) {
        id
        title
      }
    }
  `

    expect(await client.mutate({ mutation: mutation })).toMatchSnapshot()
  })

  test('test delete', async () => {
    const mutation = gql`
    mutation {
      deletePost(data: { id: "1111" }) {
        id
        title
      }
    }
  `

    expect(await client.mutate({ mutation: mutation })).toMatchSnapshot()
  })

  test('test bulk delete', async () => {
    const mutation = gql`
    mutation {
      bulkDeletePost(data: [{ id: "1111" }, { id: "2222" }, { id: "0000" }]) {
        id
        title
      }
    }
  `

    expect(await client.mutate({ mutation: mutation })).toMatchSnapshot()
  })

  test('test no returning value', async () => {
    const mutation = gql`
    mutation {
      updatePost(data: { id: "10", title: "new post 10"}){__typename}
    }
  `

    expect(await client.mutate({ mutation: mutation })).toMatchSnapshot()
  })
}
