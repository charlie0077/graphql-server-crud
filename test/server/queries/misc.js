const queries = [
  {
    name: 'alias',
    sql: `
    query {
      queryAuthor(limit: 10) {
        id
        email_alias_1: email
        email_alias_2: email
        # Note: review_alias will equal to review_alias_2, except for the fields selected
        review_alias: review(on: {star: {gt: 3}}) {
          id
          star
        }
        review_alias_2: review(on: {star: {lt: 3}}) {
          star
        }
      }
    }
    
    `
  },
  {
    name: 'multiple queries',
    sql: `
      query {
        getAuthor(id: 1) {
          id
          author_email: email
        }

        queryAuthor (limit: 10){
          id
          email
          company_id
          age
          salary
        }
      }
    `
  }
]

export default queries
