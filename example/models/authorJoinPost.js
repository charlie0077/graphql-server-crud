const { Base } = require('./base')
const libPath = process.env.NODE_ENV === 'test' ? '../../src' : 'graphql-server-crud'
const { DERIVED_TABLE } = require(libPath)

class JoinBase extends Base {
  fields = {
    id: 'Int',
    author_id: 'Int',
    age: 'Float',
    first_name: 'String',
    last_name: 'String',
    email: 'String',
    post_id: 'Int',
    title: 'String'
  }

  // no mutation will be created because of this
  queryToGenerate = ['GET', 'QUERY']
}

class AuthorJoinPost extends JoinBase {
  table = `
    select a.id as id, a.id as author_id, a.age, a.first_name, a.last_name, a.email, p.id as post_id, p.title
    from authors a left join posts p
    on a.id = p.author_id
  `
}

class PostJoinAuthor extends JoinBase {
  uniqueColumn = 'post_id'

  table = `
    select p.id as post_id, a.id as author_id, a.age, a.first_name, a.last_name, a.email, p.title
    from posts p left join authors a
    on a.id = p.author_id
  `

  fields = {
    post_id: 'Int',
    author_id: 'Int',
    first_name: 'String',
    last_name: 'String',
    age: 'Float',
    email: 'String',
    title: 'String',
    review: {
      type: 'Review',
      from: `${DERIVED_TABLE}.author_id`,
      to: 'reviews.id',
      through: { from: 'author_review.author_id', to: 'author_review.review_id' }
    }
  }
}

module.exports = { AuthorJoinPost, PostJoinAuthor }
