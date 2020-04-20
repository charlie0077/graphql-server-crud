const { Base } = require('./base')

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

module.exports = { Weather: new Weather() }
