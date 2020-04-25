# Queries

You should be able to check the schema to see all the possible queries. 

Here are some examples(exported from [tests](https://github.com/charlie0077/graphql-server-crud/tree/master/test/server/queries)).

## Simple Queries
### Get object by unique column
```graphql
query {
    getAuthor(id: 1) {
        id
        email
    }
}
```

### Fetch a list of objects
```graphql
query {
    queryAuthor {
        id
        email
        company_id
        age
        salary
    }
}
```

## Nested Queries
::: tip 
* nested object may result in more queries in the backend, ask your client don't request it if not used.
:::
### Many to one relation
```graphql
# one company may have multiple authors
query {
    queryAuthor(where: { id: { between: [1, 5] } }) {
        id
        email
        company {
            domain
        }
    }
}
```

### One to many relation
```graphql
# one author may have multiple posts
query {
    queryAuthor(where: { id: { between: [1, 5] } }) {
        id
        email
        post {
            title
        }
    }
}
```

### Many to many relation
```graphql
# one author may have multiple reviews and one review may cover multiple authors
# there is a bridge table in the backend to bridge author and review
query {
    queryAuthor(where: { id: { between: [1, 5] } }) {
        id
        email
        review {
            star
        }
    }
}
```


### Various relations in a single query
```graphql
query {
    queryAuthor(where: { id: { between: [1, 5] } }) {
        id
        email
        company {
            domain
        }
        post {
            title
        }
        review {
            star
        }
    }
}
```


### A differnt shape of various relations
```graphql
query {
    queryPost(
        where: { id: { gt: 1 } }
        offset: 0
        limit: 300
        orderBy: { column: "id" }
    ) {
        id
        title
        author {
            email
            company {
                domain
            }
            review {
                star
            }
        }
    }
}
```


### Specify innerJoin
```graphql
query {
    queryPost(
        where: { id: { gt: 1 } }
        offset: 0
        limit: 300
        orderBy: { column: "id" }
    ) {
        id
        title
        author {
            email
            # "innerJoin" here will cause author to be null if company is null 
            # the default joinType is "leftJoin"
            company (joinType: "innerJoin") {
                domain
            }
            review {
                star
            }
        }
    }
}
```


### on clause to filter nested results
```graphql
query {
    queryPost(
        where: { id: { gt: 1 } }
        offset: 0
        limit: 300
        orderBy: { column: "id" }
    ) {
        id
        title
        author {
            email
            # the default joinType is "leftJoin"
            company (joinType: "innerJoin") {
                domain
            }
            # on clause here to only select reviews that has a star between 4 and 5.
            review (on: {star: {between: [4, 5]}, content: {null: false}}){
                star
            }
        }
    }
}
```

## Filter
You can use the **where** argument to filter results. You can also use the _and or the _or operators to do a complicate search. **where** argument also support nested fields.

### Comparision: eq,ne,gt,gte,lt,lte
```graphql
query {
    # "eq" here can be "ne", "gt", "gte", "lt", "lte"
    queryAuthor (where: { id: { eq: 5 } }) {
        id
    }
}
```

### List based search: in, nin
```graphql
query {
    # "in" here can be "nin"
    queryAuthor (where: { id: { in: [1, 5] } }) {
        id
    }
}
```

### Range: between, nbetween
```graphql
query {
    # "between" here can be "nbetween"
    queryAuthor (where: { id: { between: [1, 5] } }) {
        id
    }
}
```


### Null check: null
```graphql
query {
    # you can specify null is true or false here
    queryAuthor(where: { company_id: { null: true } }) {
        id
        company_id
    }
}
```


### OR relation: _or
```graphql
query {
    # select author that
    # (1)has id less than 5
    # OR
    # (2-a)id greater than 10 AND (2-b)salary greater than 8000
    queryAuthor(
        where: {
            _or: [{ id: { gt: 10 }, salary: { gt: 8000 } }, { id: { lt: 5 } }]
        }
    ) {
        id
        salary
    }
}
```


### Combined relation: \_and and \_or
```graphql
query {
    # select author(with first name greater than "OK") that
    # (1)has id less than 5
    # OR
    # (2-a)id greater than 10 AND (2-b)salary greater than 8000
    
    queryAuthor(
        where: {
            _and: [
                { _or: [{ id: { gt: 10 }, salary: { gt: 8000 } }, { id: { lt: 5 } }] }
                { first_name: { gt: "OK" } }
            ]
        }
    ) {
        id
        salary
        first_name
    }
}
```


### Filter on nested fileds
Notice the differnce between the filter for the author and the filter for the review (the **on** clause). Here we get the list of authors that has company id less than 5 and company's country_id not less than 6.
And then the reviews are fill into the list of authors. The **on** clause here does not change the number of authors returned, while the **where** clause does.

```graphql
query {
    queryAuthor(
        where: {
            id: { gte: 3 }
            company: { id: { gte: 5 }, country: { id: { gte: 6 } } }
        }
    ) {
        id
        company {
            id
            country {
                id
            }
        }
        review (on: {star: {between: [4, 5]}, content: {null: false}}){
            star
        }
    }
}
```


## Sorting
### Sort by one column
```graphql
query {
    queryAuthor(
        orderBy: { column: "id" }
    ) {
        id
    }
}
```

### Desc order
```graphql
query {
    queryAuthor(
        orderBy: { column: "id", order: "desc"}
    ) {
        id
    }
}
```

### Multiple columns
```graphql
query {
    queryAuthor(
        orderBy: [{ column: "id", order: "desc" }, { column: "age", order: "desc" }]
    ) {
        id
        age
    }
}

```

### Sort on nested fields
::: tip 
* sorting nested objects is done in memory, be careful if you have a large number(like hundreds of thousands) of nested objects
:::

```graphql
query {
  queryPost(
    where: { id: { gt: 3 } }
    offset: 0
    limit: 30
    orderBy: { column: "id" }
  ) {
    id
    title
    author {
      email
      company {
        domain
      }
      review(orderBy: { column: "star", order: "desc" }, limit: 4, offset: 1) {
        id
        star
      }
    }
  }
}
```

## Pagenation
### Limit and offset
```graphql
query {
    queryAuthor(
        offset: 3
        limit: 5
        orderBy: { column: "id", order: "desc" }
    ) {
        id
    }
}
```

### Limit and offset on nested fields
::: tip 
* limiting the number of nested objects usually helps in terms of performance
:::
```graphql
query {
  queryPost(
    where: { id: { gt: 3 } }
    offset: 0
    limit: 30
    orderBy: { column: "id" }
  ) {
    id
    title
    author {
      email
      company {
        domain
      }
      review(orderBy: [{ column: "star", order: "desc" }], limit: 4, offset: 1) {
        id
        star
      }
    }
  }
}
```

## Aggregation
### Simple aggregation: groupBy clause
Supported aggregation: min, max, sum, avg, count, count_distinct
```graphql
query {
    queryPost(
        orderBy: { column: "author_id" }
        groupBy: ["author_id", "id"]
    ) {
        score__min
        score__max
        score__sum
        score__avg
        score__count
        score__count_distinct
    }
}
```

### Include nested filed in aggregation
```graphql
query {
    queryPost(
        orderBy: { column: "author_id" }
        groupBy: ["author_id", "id"]
    ) {
        score__min
        score__max
        score__sum
        score__avg
        score__count
        score__count_distinct
        author {
          id
        }
    }
}
```

### Filter after aggregation: having clause
```graphql
query {
    queryAuthorJoinPost(
        where: { post_id: { gt: 2 }, id: { gt: 3 } }
        orderBy: [{ column: "score__max", order: "desc" }]
        limit: 10
        offset: 0
        groupBy: ["id", "email"]
        having: { age__avg: { gt: 30 }, id: { nin: [1, 2, 6] } }
    ) {
        id
        email
        age__avg
        score__max
    }
}
```

### Complicate aggregation
```graphql
query {
    queryAuthorJoinPost(
        where: { post_id: { gt: 2 }, id: { gt: 3 } }
        orderBy: [{ column: "score__max", order: "desc" }]
        limit: 10
        offset: 0
        groupBy: ["id", "email"]
        having: {
            age__avg: { gt: 30 }
            id: { nin: [1, 2, 6] }
            email: { null: false }
        }
    ) {
        id
        email
        age__avg
        age__count
        age__count_distinct
        score__max
        review {
            id
            star
        }
    }
}
```

## Distinction
### Distinct clause
```graphql
query {
    queryAuthor(
        orderBy: { column: "company_id", order: "desc" }
        distinct: true
    ) {
        id
        company_id
    }
}
```

### Distinct on clause
This is supported by Postgres only
```graphql
query {
    queryAuthor(
        orderBy: { column: "company_id", order: "desc" }
        distinctOn: ["company_id"]
    ) {
        company_id
    }
}
```

## Miscellaneous
### Using aliases
```graphql
query {
    queryAuthor(limit: 10) {
        id
        email_alias_1: email
        email_alias_2: email
        # Note: review_alias will equal to review_alias_2, except for the fields selected
        review_alias: review(on: {star: {gt: 3}}) {
            id
            star
        }
        review_alias_2: review(on: {star: {lt: 3}}) {
            star
        }
    }
}
```

### Multiple queries in one request
```graphql
query {
    getAuthor(id: 1) {
        id
        author_email: email
    }

    queryAuthor (limit: 10){
        id
        email
        company_id
        age
        salary
    }
}
```
