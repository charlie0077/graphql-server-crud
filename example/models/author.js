const { Base } = require('./base')

class Author extends Base {
  table = 'authors'
  fields = {
    id: 'Int',
    company_id: 'Int',
    first_name: 'String',
    last_name: 'String',
    email: 'String',
    age: 'Float',
    salary: 'Float',
    company: { type: 'Company', from: 'authors.company_id', to: 'companies.id' },
    post: { type: 'Post', from: 'authors.id', to: 'posts.author_id' },
    review: {
      type: 'Review',
      from: 'authors.id',
      to: 'reviews.id',
      through: { from: 'author_review.author_id', to: 'author_review.review_id' }
    }
  }

  // no mutation will be created because of this
  queryToGenerate = ['GET', 'QUERY']
}

module.exports = { Author }
