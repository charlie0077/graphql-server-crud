// common model configurations defined in Base
const { Base } = require('./base')

class Author extends Base {
  // This is the table name that will be used.
  // You can also define a derived table here.
  table = 'authors'

  // This defines the GraphQL interface
  fields = {
    id: 'Int',
    company_id: 'Int',
    first_name: 'String',
    last_name: 'String',
    email: 'String',
    age: 'Float',
    salary: 'Float',
    active: 'Boolean',

    // author can only belong to one company, therefore the type here is 'Company', not ['Company']
    company: { type: 'Company', from: 'authors.company_id', to: 'companies.id' },

    // author may have multiple Post, hence the type here is ['Post']
    post: { type: ['Post'], from: 'authors.id', to: 'posts.author_id' },

    // an author may have multiple reviews and one review may include multiple authors
    // 'author_review' is the "bridge" table here
    review: {
      type: ['Review'],
      from: 'authors.id',
      to: 'reviews.id',
      through: { from: 'author_review.author_id', to: 'author_review.review_id' }
    }
  }

  // This defines what resolvers will be created.
  // no mutation will be created because of this
  // the full list: ['INSERT', 'DELETE', 'UPDATE', 'GET', 'QUERY', 'BULK_INSERT', 'BULK_UPDATE', 'BULK_DELETE']
  queryToGenerate = ['GET', 'QUERY']
}

module.exports = { Author: new Author() }
