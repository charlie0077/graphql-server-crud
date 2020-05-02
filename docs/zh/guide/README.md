# 介绍
这是一个轻量级的框架来帮你快速搭建一个GraphQL服务器。框架的主要目标是减少你的代码量，节省你的时间，同时给你足够的自由度。

## 思想
* 大幅度减少CRUD（增删改查）的代码量。
* 它是代码而不是黑盒子，你拥有完全的控制权，例如你可能想部署到Serverless上。
* 不需要学很多新的语法。
* 容易加入到你现有的项目。
* 支持所有[knex](http://knexjs.org/)支持的数据库。
* 对于超级复杂的用户需求，你可能还是要直接用knex来充分发挥sql的性能。

## 它是如何工作的
你定义一个**model**. 这个库会产生常用的GraphQL schema, resolvers代码。它还集成了一个编译器来把GraphQL的Search Query编译成knex Query, 来支持复杂的搜索查询(filter, groupBy, join, aggregations, nested fields等)。你可以继承框架提供的**MobelBase**来搭建你的**Model**逻辑。你也可以把**model**当成你的数据库访问层，在你的任何业务代码中调用它来访问你的数据。

## 特性
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
