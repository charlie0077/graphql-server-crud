const queries = [
  {
    name: 'many to one',
    sql: `
      query {
        queryAuthor(where: { id: { between: [1, 5] } }) {
          id
          email
          company {
            domain
          }
        }
      }
    `
  },
  {
    name: 'one to many',
    sql: `
      query {
        queryAuthor(where: { id: { between: [1, 5] } }) {
          id
          email
          post(orderBy: {column: "id"}) {
            title
          }
        }
      }
    `
  },
  {
    name: 'many to many',
    sql: `
      query {
        queryAuthor(where: { id: { between: [1, 5] } }) {
          id
          email
          review (orderBy: {column: "id"}) {
            star
          }
        }
      }
    `
  },
  {
    name: 'all relation',
    sql: `
      query {
        queryAuthor(where: { id: { between: [1, 5] } }) {
          id
          email
          company {
            domain
          }
          post (orderBy: {column: "id"}) {
            title
          }
          review (orderBy: {column: "id"}) {
            star
          }
        }
      }
    `
  },
  {
    name: 'more layers',
    sql: `
      query {
        queryPost(
          where: { id: { gt: 1 } }
          offset: 0
          limit: 300
          orderBy: { column: "id" }
        ) {
          id
          title
          author {
            email
            company {
              domain
            }
            review (orderBy: {column: "id"}) {
              star
            }
          }
        }
      }
    `
  },
  {
    name: 'top down',
    sql: `
      query {
        queryCompany(
          where: { id: { eq: 6 } }
          offset: 0
          limit: 10
          orderBy: { column: "id" }
        ) {
          id
          author {
            email
            review {
              star
            }
          }
        }
      }
    `
  },
  {
    name: 'various join type: use innerJoin',
    sql: `
      query {
        queryPost(
          where: { id: { gt: 1 } }
          offset: 0
          limit: 300
          orderBy: { column: "id" }
        ) {
          id
          title
          author {
            email
            # "innerJoin" here will cause author to be null if company is null 
            company (joinType: "innerJoin") {
              domain
            }
            review {
              star
            }
          }
        }
      }
    `
  },
  {
    name: 'on clause 1',
    sql: `
      query {
        queryPost(
          where: { id: { gt: 1 } }
          offset: 0
          limit: 300
          orderBy: { column: "id" }
        ) {
          id
          title
          author {
            email
            company (joinType: "innerJoin") {
              domain
            }
            review (on: {star: {between: [4, 5]}, content: {null: false}}){
              star
            }
          }
        }
      }
    `
  },
  {
    name: 'on clause 2',
    sql: `
      query {
        queryPost(
          where: { id: { gt: 1 } }
          offset: 0
          limit: 300
          orderBy: { column: "id" }
        ) {
          id
          title
          author {
            email
            company (joinType: "innerJoin") {
              domain
            }
            review (on: {star: {between: [4, 5]}, content: {null: true}}){
              star
            }
          }
        }
      }
    `
  }

]

export default queries
