[![npm version](https://badge.fury.io/js/graphql-server-crud.svg)](https://www.npmjs.com/package/graphql-server-crud)
[![CircleCI](https://circleci.com/gh/charlie0077/graphql-server-crud.svg?style=shield)](https://circleci.com/gh/charlie0077/graphql-server-crud)
[![codecov](https://codecov.io/gh/charlie0077/graphql-server-crud/branch/master/graph/badge.svg)](https://codecov.io/gh/charlie0077/graphql-server-crud)

Please go to [https://nostalgic-perlman-fe9f48.netlify.com](https://nostalgic-perlman-fe9f48.netlify.com/guide/) for the complete documentation.

# Introduction
This is a lightweight javascript framework/library to help you build a GraphQL server efficiently. It aims to reduce your code size, save you time and gives you the flexibilities you need.

## Philosophy
* Reduce the CRUD related code you need to write.
* It is code, not black box service, you have full control about logic, deployment, etc.
* You don't need to learn new random definitions: syntax, directive, magic, etc.
* It coexists with your existing project.
* Support multiple databases: it should support what [knex](http://knexjs.org/) supports.
* It is not discouraged to build your own complicate queries to support complicate use case.

# Getting Started

The following is to give you a quick idea of how to get started. You may want to refer to a full example [here](https://nostalgic-perlman-fe9f48.netlify.app/example/), which contains test data.

## Install package
``` sh
npm install graphql-server-crud
```
## Define the "model"
```js
const { ModelBase } = require('graphql-server-crud')
const { knex } = require('../db') // this is your typical knex db

class Company extends ModelBase {
  knex = knex
  table = 'companies'
  fields = {
    id: 'Int',
    domain: 'String',
    public: 'Boolean',
    phone: 'String',
    sales: 'Float',
    customers: 'Int'
  }
}
```


## Add auto-generated typeDefs and resolvers to your root
Add these followinng lines to your root typeDefs and resolvers variables.

``` js
// add default typeDefs and resolvers
const { addTypeDefs, addResolvers } = require('graphql-server-crud')
const models = require('./models')
addTypeDefs(typeDefs, models)
addResolvers(resolvers, models)
```

You can check a full example file [here](https://github.com/charlie0077/graphql-server-crud/blob/master/example/server.js). 

## That is it!
You have a basic CRUD endpoint for **Company** now.

Run a simple query:

![Query](https://github.com/charlie0077/graphql-server-crud/blob/master/docs/.vuepress/public/guide-getting-started-1.png?raw=true)

The schema:

![Schema](https://github.com/charlie0077/graphql-server-crud/blob/master/docs/.vuepress/public/guide-getting-started-2.png?raw=true)

## A more complicate query example
```graphql
query {
  # queryAuthorJoinPost is a derived table(runtime view)
  queryAuthorJoinPost(
    # complicate filter condition
    where: {
      _and: [
        { _or: [{ id: { gt: 10 }, email: { gt: "k" } }, { id: { lt: 5 } }] }
        { first_name: { gt: "OK" } }
      ]
    }
    # top level orderBy
    orderBy: [{ column: "score__max", order: "desc" }]
    limit: 10
    offset: 0
    # support aggregation
    groupBy: ["id", "email"]
    having: {
      age__avg: { gt: 30 }
      id: { nin: [1, 2, 6] }
      email: { null: false }
    }
  ) {
    id
    email
    # aggregations
    age__avg
    age__count
    age__count_distinct
    score__max
    # nested field in group by
    review(
      on: { star: { gt: 2 } }
      limit: 5
      offset: 1
      orderBy: [{ column: "star", order: "desc" }]
    ) {
      id
      star
    }
  }
}
```

## How it works
You define a **model**. The library generates common GraphQL schema, resolvers logic for you. To support complicate search queries(filter, groupBy, join, nested fields, etc), it also has a built-in **compiler** to compile the filter input to [knex](http://knexjs.org/) code. A **MobelBase** class is provided to you so that you can build your custom logic on top of it. You can also use the **model** as your database client in any place of your logic.

## Features
* logic generation for schema
* logic generation for common resolvers
* support queries: get, list(search by filters)
* support mutation: insert, delete, update, bulk insert, bulk delete, bulk update
* support common where filters: =, <>, >, <, between, in, or, and, etc.
* support common aggregations: groupBy, having, sum, avg, min, max, count, distinct, etc.
* support common components in a query: offset, limit, order by, etc.
* support nested objects queries
* no N+1 problem for common queries
* coexists with your current code, custom schema, custom resolver.
* it does not care if you are using graphql-server, graphql-lambda, or graphql-express, etc.


Please go to [https://nostalgic-perlman-fe9f48.netlify.com](https://nostalgic-perlman-fe9f48.netlify.com/guide/) for the complete documentation.
