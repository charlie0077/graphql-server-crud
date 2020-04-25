# 自定义逻辑
Since it is just code. You are free to do whatever you need.

## Custom CRUD
```js
class Post extends Base {
  table = 'posts'
  fields = {
    id: 'String',
    author_id: 'String',
    title: 'String',
    public: 'String',
    clicks: 'Int',
    score: 'Float',
    author: 'Author'
  }

  update (args, context) {
    console.log('Custom update logic for "Post" model here')
    super.update(args, context)
  }
}
```

## Before and after hook
```js
class Company extends Base {
  table = 'companies'
  fields = {
    id: 'Int',
    domain: 'String',
    public: 'Boolean',
    phone: 'String',
    sales: 'Float',
    customers: 'Int'
  }

  async before (args, context, info) {
    console.log('This is invoked before any query/mutatin to company')
  }

  async after (args, context, info) {
    console.log('This is invoked after any query/mutatin to company')
  }
}
```

## FETCH and BULK_FETCH
FETCH and BULK_FETCH are considered as query, and there is no default resolvers defined for them.

You can custom the CRUD logic like this:
```js
const Base = require('./base')

class Weather extends Base {
  fields = {
    city: 'String',
    rain: 'Boolean',
    temperature: 'Int'
  }

  queryToGenerate = ['FETCH', 'BULK_FETCH']

  bulkFetch (args) {
    const res = []
    args.data.forEach(each => {
      res.push({
        city: each.city,
        rain: true,
        temperature: 89
      })
    })
    return res
  }

  fetch (args) {
    return {
      city: args.data.city,
      rain: true,
      temperature: 89
    }
  }
}

module.exports = Weather

```