# Configurations

The following **configuration** exists in your **model**.

You can refer the [this](https://github.com/charlie0077/graphql-server-crud/blob/master/example/model) for examples.

## knex
[knex](http://knexjs.org/#Installation-node/) is used in the library and it is required to pass to the library. You still conrol the logic of defining knex according to your environment and requirements, for example, deployment in serverless may need a different knex connection pool size. 

This is the knex function which usually is defined by:
```js 
const knex = require('knex')(config)
```

If you are not familiar with knex, do not worry too much about it. It is just a query builder and you can follow their great [doc](http://knexjs.org/#Installation-node) to get started within minutes. You can also refer to the [example]([this](https://github.com/charlie0077/graphql-server-crud/blob/master/example)) for a complete setup.

## table
This is the table name or a derived table.

## fields
These are the fields exposed to the client.

## queryToGenerate
An array of string that defines what kind of typeDefs and resolvers to generate.
Following fields are allowed currently:
```js
queryToGenerate = ['INSERT', 'DELETE', 'UPDATE', 'GET', 'QUERY', 'BULK_INSERT', 'BULK_UPDATE', 'BULK_DELETE']
```

## uniqueColumn
The unique column name, default to "id"

## knexDebug
Enable this to see some debug info about sql.

## timeout
This controls when the query should timeout. Please refer to [here](http://knexjs.org/#Builder-timeout) for the complete information.
Default value is 60000, which is 60 seconds.

## maxLimit
The maximum limit number of records to return for a query or mutation.

::: tip
This also applies to nested fields
:::

## defaultLimit
The default limit for a query if limit is not specified by client.
You should configure this in your model.

::: tip
This also applies to nested fields
:::

## defaultOffset
The default offset for a query if offset is not specified by client.

::: tip
This also applies to nested fields
:::

## logger
The logger object. Default is: console.log

## colorMapping
Different color is showed for the different types of query, to make it easier for you to debug.

Default colorMapping:
```js
colorMapping = {
    GET: '#52BE80',
    LIST: '#48C9B0',
    INSERT: '#7FB3D5',
    UPDATE: '#F7DC6F',
    DELETE: '#F1948A',
    BULK_INSERT: '#7FB3D5',
    BULK_UPDATE: '#F7DC6F',
    BULK_DELETE: '#F1948A'
}
```
