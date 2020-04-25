# Introduction
This is a lightweight framework/library to help you build a GraphQL server efficiently. It aims to reduce your code size, save you time and gives you the flexibilities you need.

## Philosophy
* Reduce the CRUD related code you need to write.
* It is code, not black box service, you have full control about logic, deployment, etc.
* You don't need to learn new random definitions: syntax, directive, magic, etc.
* It coexists with your existing project.
* Support multiple databases: it should support what [knex](http://knexjs.org/) supports.
* It is not discouraged to build your own complicate queries to support complicate use case.

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

## Compared to ...?
There are some other libraries/tools/services that you may want to check: such as hasura, prisma, postgraphile, joinmonster, etc. They have different goals and different philosophies. Given everything is evolving fast, we will not do a detail comparison here.
