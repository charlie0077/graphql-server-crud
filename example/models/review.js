const { Base } = require('./base')

class Review extends Base {
  table = 'reviews'
  fields = {
    id: 'Int',
    content: 'String',
    star: 'Float'
  }

  // do not expose this
  queryToGenerate = []
}

module.exports = { Review: new Review() }
