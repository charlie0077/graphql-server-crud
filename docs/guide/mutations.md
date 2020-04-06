# Mutations

You should be able to check the schema to see all the possible mutations. 

Here are some examples.

## Insert
```graphql
mutation {
  insertPost (data: {id: "123", title: "new post"}) {
    id
    title
  }
}
```

## Bulk Insert
```graphql
mutation {
  bulkInsertPost(
    data: [
      { id: "234567", title: "new post 1"}
      { id: "222222", title: "new post 2"}
    ]
  ) {
    id
    title
  }
}
```

## Update
```graphql
mutation {
  updatePost(data: { id: "1", title: "new post 2"}) {
    id
    title
  }
}
```

## Bulk Update
```graphql
mutation {
  bulkUpdatePost(
    data: [
      { id: "1", title: "new post 2" }
      { id: "2", title: "new post 2" }
    ]
  ) {
    id
    title
  }
}
```

## Delete
```graphql
mutation {
  deletePost(data: { id: "3" }) {
    id
    title
  }
}
```

## Bulk delete
```graphql
mutation {
  bulkDeletePost(data: [{ id: "14" }, { id: "4" }, { id: "11111111111" }]) {
    id
    title
  }
}
```

## Mutation without returning value
If you do not need any return value, use the meta field [__typename](https://graphql.org/learn/schema/).

```graphql
mutation {
  updatePost(data: { id: "1", title: "new post 2"}){__typename}
}
```