# Configurations

The following **configuration** exists in your **model**.

You can refer the [this](https://github.com/charlie0077/graphql-server-crud/blob/master/example/model) for examples.

## knex
This is the knex function which usually is defined by:
```js 
const knex = require('knex')(config)
```

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

## knexDebug
Enable this to see some debug info about sql.

## timeout
This controls when the query should timeout. Please refer to [here](http://knexjs.org/#Builder-timeout) for the complete information.
Default value is 60000, which is 60 seconds.

## maxLimit
The maximum limit number of records to return for a query or mutation.

## defaultLimit
The default limit for a query if limit is not specified by client.
You should configure this in your model.

## defaultOffset
The default offset for a query if offset is not specified by client.
You should configure this in your model.

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
