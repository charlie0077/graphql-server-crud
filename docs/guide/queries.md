# Queries

You should be able to check the schema to see all the possible queries. 

Here are some examples.

## Simple query
```graphql
query {
  getAuthor(id: "1") {
    id
    email
  }
}
```
## Nested query
```graphql
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
```
## Aggregation
```graphql
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
```
## More complicate search queries
```graphql
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
```
## Limit and offset
```graphql
query {
  queryPost(
    offset: 0
    limit: 3
  ) {
    id
    title
  }
}
```
## Sort
```graphql
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
```

## Multiple queries in a request
```graphql
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
```