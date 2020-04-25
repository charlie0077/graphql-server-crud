# Model

Model defines your graphql interface and some default CRUD resolvers.

Here is a quick example to show you what it typically looks like:

<<< @/example/models/author.js

::: tip 
The most common fields that you would define in a model are: 
* **table**: your data source
* **fields**: the GraphQL interface
* **queryToGenerate**: what default CRUD resolvers to generate
:::

**Please refer to [here](/guide/configurations) for all possible configurations of a model.**
