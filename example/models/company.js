const { Author } = require('./author')

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

    const res = await Author.get({ id: 2, select: ['age'], include: { review: { select: ['star'] } } })
    console.log('This is the reviews for author 2:', res.review)
  }

  async after (args, context, info) {
    console.log('This is invoked after any query/mutatin to company')
  }
}

module.exports = { Company: new Company() }
