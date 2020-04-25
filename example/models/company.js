const { Author } = require('./author')

const { Base } = require('./base')

class Company extends Base {
  table = 'companies'
  fields = {
    id: 'Int',
    country_id: 'Int',
    domain: 'String',
    public: 'Boolean',
    phone: 'String',
    sales: 'Float',
    customers: 'Int',
    author: { type: ['Author'], from: 'companies.id', to: 'authors.company_id' },
    country: { type: 'Country', from: 'companies.country_id', to: 'countries.id' }
  }

  async before (args, context, info) {
    console.log('This is invoked before any query/mutatin to company')

    const author1 = await Author.get(1)
    console.log('This is author 1:', author1)

    const author2 = await Author.get({ id: 2, select: ['age'], include: { review: { select: ['star'] } } })
    console.log('This is the reviews for author 2:', author2.review)

    const authorListForCompany3 = await Author.query({
      where: { company: { id: { eq: 3 } } },
      select: ['email', 'age'],
      include: {
        review: { select: ['star'] },
        company: { select: ['id'] }
      }
    })
    console.log('This is the author list for company 2:', authorListForCompany3)
  }

  async after (args, context, info) {
    console.log('This is invoked after any query/mutatin to company')
  }
}

module.exports = { Company: new Company() }
