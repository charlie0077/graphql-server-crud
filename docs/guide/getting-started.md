# Getting Started

The following is to give you a quick idea of how to get started. You may want to refer to a full example [here](/example/), which contains test data.
## Install package
``` sh
npm install graphql-server-crud
```

## Define the "model"
```js
const { ModelBase } = require('graphql-crud')
const { knex } = require('../db') // this is your knex db

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

You can check a full example file [here](https://github.com/charlie0077/graphql-server-crud/blob/master/example/index.js). 

## That is it!
You have a basic CRUD endpoint for **Company** now.

Run a simple query:
<img :src="$withBase('/guide-getting-started-1.png')">

The schema:
<img :src="$withBase('/guide-getting-started-2.png')">