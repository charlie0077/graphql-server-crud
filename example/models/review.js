const { Base } = require('./base')

class Review extends Base {
  table = 'reviews'
  fields = {
    id: 'Int',
    content: 'String',
    star: 'Float'
  }
}

module.exports = { Review }
