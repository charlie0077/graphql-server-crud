Please go to [https://nostalgic-perlman-fe9f48.netlify.com](https://nostalgic-perlman-fe9f48.netlify.com/guide/) for the complete documentation.

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

## Compared to ...?
There are some other libraries/tools/services that you may want to check: such as hasura, prisma, postgraphile, joinmonster, etc. They have different goals and different philosophies. Given everything is evolving fast, we will not do a detail comparison here. 
