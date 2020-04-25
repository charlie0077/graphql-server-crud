const queries = [
  {
    name: 'include nested object in group by wihout unique column',
    sql: `
      query {
        queryAuthor(groupBy: ["email"]) {
          review {
            id
          }
        }
      }
    `
  },
  {
    name: 'invalid joinType',
    sql: `
      query {
        queryCompany(where: { id: { eq: 6 } }) {
          id
          author(joinType: "invalidJoin") {
            email
          }
        }
      }
    `
  }
]

export default queries
