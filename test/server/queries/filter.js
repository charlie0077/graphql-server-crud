const queries = [
  {
    name: 'eq',
    sql: `
      query {
        queryAuthor (where: { id: { eq: 5 } }) {
          id
        }
      }
    `
  },
  {
    name: 'ne',
    sql: `
      query {
        queryAuthor (where: { id: { ne: 5 } }) {
          id
        }
      }
    `
  },
  {
    name: 'gt',
    sql: `
      query {
        queryAuthor (where: { id: { gt: 5 } }) {
          id
        }
      }
    `
  },
  {
    name: 'gte',
    sql: `
      query {
        queryAuthor (where: { id: { gte: 5 } }) {
          id
        }
      }
    `
  },
  {
    name: 'lt',
    sql: `
      query {
        queryAuthor (where: { id: { lt: 5 } }) {
          id
        }
      }
    `
  },
  {
    name: 'lte',
    sql: `
      query {
        queryAuthor (where: { id: { lte: 5 } }) {
          id
        }
      }
    `
  },
  {
    name: 'in',
    sql: `
      query {
        queryAuthor (where: { id: { in: [1, 5] } }) {
          id
        }
      }
    `
  },
  {
    name: 'nin',
    sql: `
      query {
        queryAuthor (where: { id: { nin: [1, 5] } }) {
          id
        }
      }
    `
  },
  {
    name: 'between',
    sql: `
      query {
        queryAuthor (where: { id: { between: [1, 5] } }) {
          id
        }
      }
    `
  },
  {
    name: 'nbetween',
    sql: `
      query {
        queryAuthor (where: { id: { nbetween: [1, 5] } }) {
          id
        }
      }
    `
  },
  {
    name: 'null',
    sql: `
      query {
        queryAuthor(where: { company_id: { null: true } }) {
          id
          company_id
        }
      }
    `
  },
  {
    name: 'not null',
    sql: `
      query {
        queryAuthor(where: { company_id: { null: false } }) {
          id
          company_id
        }
      }
    `
  },
  {
    name: 'or relation',
    sql: `
      query {
        # select author that
        # (1)has id less than 5
        # OR
        # (2-a)id greater than 10 AND (2-b)salary greater than 8000
        queryAuthor(
          where: {
            _or: [{ id: { gt: 10 }, salary: { gt: 8000 } }, { id: { lt: 5 } }]
          }
        ) {
          id
          salary
        }
      }
    `
  },
  {
    name: 'and + or relation',
    sql: `
      query {
        # select author(with first name greater than "OK") that
        # (1)has id less than 5
        # OR
        # (2-a)id greater than 10 AND (2-b)salary greater than 8000
        
        queryAuthor(
          where: {
            _and: [
              { _or: [{ id: { gt: 10 }, salary: { gt: 8000 } }, { id: { lt: 5 } }] }
              { first_name: { gt: "OK" } }
            ]
          }
        ) {
          id
          salary
          first_name
        }
      }
    `
  }
]

export default queries
