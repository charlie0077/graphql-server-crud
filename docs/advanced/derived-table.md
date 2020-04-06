# Use derived table

You can use a derived table like this:
```js
const Base = require('./base')

class JoinBase extends Base {
  fields = {
    id: 'String',
    author_id: 'String',
    first_name: 'String',
    last_name: 'String',
    email: 'String',
    post_id: 'String',
    title: 'String',
    content: 'String',
    description: 'String',
    age: 'Float'
  }

  // no mutation will be created because of this
  queryToGenerate = ['GET', 'QUERY']
}

class AuthorJoinPost extends JoinBase {
  table = `
    select a.id, a.id as author_id, a.age, a.first_name, a.last_name, a.email, p.id as post_id, p.title
    from authors a left join posts p
    on a.id = p.author_id
  `
}

class PostJoinAuthor extends JoinBase {
  table = `
    select p.id, a.id as author_id, a.age, a.first_name, a.last_name, a.email, p.id as post_id, p.title
    from posts p left join authors a
    on a.id = p.author_id
  `
}

module.exports = [AuthorJoinPost, PostJoinAuthor]

```