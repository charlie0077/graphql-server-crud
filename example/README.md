# Steps:

## 1. launch database
```sh
cd database
docker-compose up
```

## 2. run grapqhql api server
```sh
npm install
npm run seed # this will seed the data
npm start
```


## 3. go to browser http://localhost:4000/

## 4. use graphql playground to test CRUD
### (1). get an item
```graphql
query {
  getAuthor(id: "1") {
    id
    email
  }
}
```

### (2). complicate search
```graphql
query {
  queryAuthor(
    where: {
      first_name: { ne: "Josh" },
      last_name: { ne: "Parisian" },
    }
    orderBy: [{ column: "email", order: "asc" }, { column: "id", order: "asc" }]
    limit: 2
    offset: 0
  ) {
    id
    email
    first_name
    last_name
  }
}

query {
  queryAuthor(
    where: {
      _or: [
        {
          email: { in: ["Josh"] }
          last_name: { in: ["email2"] }
          _or: [{ id: { eq: "1" } , last_name: { in: ["email2"] }}]
        }
        { first_name: { in: ["Josh", "1"] } }
      ],
      _and: [
        {
          email: { in: ["Josh"] }
          last_name: { in: ["email2"] }
          _or: [{ id: { eq: "1" } , last_name: { in: ["email2"] }}]
        }
        { first_name: { in: ["Josh", "1"] } }
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

### (3). get joined data
```graphql
query {
  getAuthorJoinPost(id: "1") {
    id
    email
    title
  }

  queryAuthorJoinPost(
    where: {
      post_id: { gt: "2" }
    }
    orderBy: [{ column: "title", order: "asc" }]
    limit: 4
    offset: 0
  ) {
    id
    email
    post_id
    title
    content
  }
}
```

### (4). group_by and aggregation
```graphql
query {
  queryAuthorJoinPost(
    where: {
      post_id: { gt: "2" }
    }
    orderBy: [{ column: "id", order: "asc" }]
    limit: 10
    offset: 0
    groupBy: ["id"]
    having: {
      age__avg: {gt: 30}
    }
  ) {
    id
    age__avg
  }
}
```

### (5). insert
```graphql
mutation {
  insertPost (data: {title: "new post", content: "new content"}) {
    id
    title
    content
    description
  }
}


mutation {
  insertPost (data: {id: "1222222", title: "new post", content: "new content"}) {
    id
    title
    content
    description
  }
}

mutation {
  bulkInsertPost(
    data: [
      { id: "234567", title: "new post", content: "new content" }
      { title: "new post", content: "new content" }
    ]
  ) {
    id
    title
    content
    description
  }
}

```

### (6). update
```graphql
mutation {
  updatePost(data: { id: "1", title: "new post 2", content: "new content" }) {
    id
    title
    content
    description
  }
}

mutation {
  bulkUpdatePost(
    data: [
      { id: "1", title: "new post 2", content: "new content" }
      { id: "2", title: "new post 2", content: "new content" }
    ]
  ) {
    id
    title
  }
}
```

### (7). delete
```graphql
mutation {
  deletePost(data: { id: "3" }) {
    id
    title
    content
    description
  }
}

mutation {
  bulkDeletePost(data: [{ id: "14" }, { id: "4" }, { id: "11111111111" }]) {
    id
    title
    content
    description
  }
}

```



