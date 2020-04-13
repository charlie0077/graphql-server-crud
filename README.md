[![npm version](https://badge.fury.io/js/graphql-server-crud.svg)](https://www.npmjs.com/package/graphql-server-crud)
[![CircleCI](https://circleci.com/gh/charlie0077/graphql-server-crud.svg?style=shield)](https://circleci.com/gh/charlie0077/graphql-server-crud)
[![codecov](https://codecov.io/gh/charlie0077/graphql-server-crud/branch/master/graph/badge.svg)](https://codecov.io/gh/charlie0077/graphql-server-crud)

Please go to [https://nostalgic-perlman-fe9f48.netlify.com](https://nostalgic-perlman-fe9f48.netlify.com/guide/) for the complete documentation.

# Getting Started

The following is to give you a quick idea of how to get started. You may want to refer to a full example [here](https://github.com/charlie0077/graphql-server-crud/blob/master/example), which contains test data.

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

# Introduction
This library aims to reduce the boilerplate code you need to write for GraphQL schema definition, common resolvers, common code for CRUD.

## Philosophy
* Reduce the CRUD related code you need to write.
* It is code, not service, you have full control about logic, deployment, etc.
* You don't need to learn new random definitions: syntax, directive, magic, etc.
* It coexists with your existing project.
* It is not a ORM and ORM is never the goal.
* Support multiple databases: it should support what [knex](http://knexjs.org/) supports.
* Feel free to copy the source code to your project and iterate according to your own need.
* For complicate query, you probably better build the query by yourself, using query builder, raw sql, etc. Use this library to save your time writing repetive and simple code and used the saved time to tune your own code to leverage the full power of sql.

## How it works
You define a **model**. The library generates common GraphQL schema, resolvers logic for you. It also has its opinioned format of the input type and there is built-in **compiler** to compile the filter input to [knex](http://knexjs.org/) code. A **MobelBase** class is provided to you so that you can build your own logic on top of it. 

## Features
* logic generation for schema
* logic generation for common resolvers
* support queries: get, list(search by filters)
* support mutation: insert, delete, update, bulk insert, bulk delete, bulk update
* support common where filters: =, <>, >, <, between, in, or, and, etc.
* support common aggregations: groupBy, having, sum, avg, min, max, count, etc.
* support common components in a query: offset, limit, order by, etc.
* support nested queries
* no N+1 problem for common queries
* coexists with your current code, custom schema, custom resolver.
* it does not care if you are using graphql-server, graphql-lambda, or graphql-express, etc.


Please go to [https://nostalgic-perlman-fe9f48.netlify.com](https://nostalgic-perlman-fe9f48.netlify.com/guide/) for the complete documentation.
