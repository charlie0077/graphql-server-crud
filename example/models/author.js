const { Base } = require('./base')

class Author extends Base {
  table = 'authors'
  fields = {
    id: 'String',
    company_id: 'Int',
    first_name: 'String',
    last_name: 'String',
    email: 'String',
    age: 'Float',
    salary: 'Float',
    company: 'Company'
    // posts: [Post]
  }

  // no mutation will be created because of this
  queryToGenerate = ['GET', 'QUERY']
}

module.exports = { Author }
