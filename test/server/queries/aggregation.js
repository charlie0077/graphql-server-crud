const queries = [
  {
    name: 'aggregation simple 1',
    sql: `
      query {
        queryAuthorJoinPost(
          where: { post_id: { gt: 2 }, id: {gt: 3} }
          orderBy: [{ column: "score__max", order: "desc" }]
          limit: 10
          offset: 0
          groupBy: ["id", "email"]
          having: { age__avg: { gt: 30 }, id: { nin: [1, 2, 6] } }
        ) {
          id
          email
          age__avg
          score__max
        }
      }
    `
  },
  {
    name: 'aggregation simple 2',
    sql: `
      query {
        queryAuthorJoinPost(
          where: { post_id: { gt: 2 }, id: {gt: 3} }
          orderBy: [{ column: "score__max", order: "desc" }]
          limit: 10
          offset: 0
          groupBy: ["id", "email"]
          having: { email: { null: true } }
        ) {
          id
          email
          age__avg
          score__max
        }
      }
    `
  },
  {
    name: 'aggregation with nested field',
    sql: `
      query {
        queryAuthorJoinPost(
          where: { post_id: { gt: 2 }, id: { gt: 3 } }
          orderBy: [{ column: "score__max", order: "desc" }]
          limit: 10
          offset: 0
          groupBy: ["id", "email"]
          having: {
            age__avg: { gt: 30 }
            id: { nin: [1, 2, 6] }
            email: { null: false }
          }
        ) {
          id
          email
          age__avg
          age__count
          age__count_distinct
          score__max
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
