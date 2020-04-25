const { Base } = require('./base')

class Country extends Base {
  table = 'countries'
  fields = {
    id: 'Int',
    name: 'String'
  }

  // do not expose this
  queryToGenerate = []
}

module.exports = { Country: new Country() }
