const queries = [
  {
    name: 'get by id',
    sql: `
      query {
        getAuthor(id: 1) {
          id
          email
        }
      }
    `
  },
  {
    name: 'simple search',
    sql: `
      query {
        queryAuthor {
          id
          email
          company_id
          age
          salary
        }
      }
    `
  },
  {
    name: 'limit & offset & orderBy asc',
    sql: `
      query {
        queryAuthor(
          offset: 3
          limit: 5
          orderBy: { column: "id" }
        ) {
          id
        }
      }
    `
  },
  {
    name: 'limit & offset & orderBy desc',
    sql: `
      query {
        queryAuthor(
          offset: 3
          limit: 5
          orderBy: { column: "id", order: "desc" }
        ) {
          id
        }
      }
    `
  },
  {
    name: 'distinct',
    sql: `
      # limitation: id will always be included
      query {
        queryAuthor(
          orderBy: { column: "company_id", order: "desc" }
          distinct: ["company_id"]
        ) {
          id
          company_id
        }
      }
    `
  },
  {
    name: 'distinct on',
    sql: `
      # support postgresql only
      query {
        queryAuthor(
          orderBy: { column: "company_id", order: "desc" }
          distinctOn: ["company_id"]
        ) {
          company_id
        }
      }
    `
  }
]

export default queries
