const { Base } = require('./base')

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

module.exports = { Company }
