const queries = [
  {
    name: 'aggregation simple',
    sql: `
      query {
        queryAuthorJoinPost(
          where: { post_id: { gt: 2 }, id: {gt: 3} }
          orderBy: [{ column: "score__sum", order: "desc" }]
          limit: 10
          offset: 0
          groupBy: ["id", "email"]
          having: { age__avg: { gt: 30 }, id: { nin: [1, 2, 6] } }
        ) {
          id
          email
          age__avg
          score__sum
        }
      }
    `
  },
  {
    name: 'aggregation with nested field',
    sql: `
      query {
        queryAuthorJoinPost(
          where: { post_id: { gt: 2 }, id: {gt: 3} }
          orderBy: [{ column: "score__sum", order: "desc" }]
          limit: 10
          offset: 0
          groupBy: ["id", "email"]
          having: { age__avg: { gt: 30 }, id: { nin: [1, 2, 6] }, email: {null: false} }
        ) {
          id
          email
          age__avg
          score__sum
          review {
            id
            star
          }
        }
      }
    `
  }
]

export default queries
