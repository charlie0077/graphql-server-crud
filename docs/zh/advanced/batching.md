# Batching
N + 1 problem does not exist in this implementation.

## Run the following graphql query. 
```graphql
query {
  queryPost(
    where: { id: { gt: 1 } }
    offset: 0
    limit: 3
    orderBy: { column: "id" }
  ) {
    id
    title
    author {
      email
      company {
        domain
      }
      review {
        star
      }
    }
  }
}
```

You should be able to see result similar to the following.
```json
{
  "data": {
    "queryPost": [
      {
        "id": 2,
        "title": "Info tawu bic nuzi vorehben lazgoh gaw nite.",
        "author": {
          "email": "jejzivde@lim.mg",
          "company": {
            "domain": "nitdopfiz.ro"
          },
          "review": [
            {
              "star": 4.9355
            },
            {
              "star": 4.1723
            }
          ]
        }
      },
      {
        "id": 3,
        "title": "Seunla vivik uji totunusa kazaha ruguk di zuvon.",
        "author": {
          "email": "uw@rol.bb",
          "company": null,
          "review": [
            {
              "star": 3.9008
            },
            {
              "star": 3.1633
            }
          ]
        }
      },
      {
        "id": 4,
        "title": "Fogow datiha ewa na pumav pe heva wepma.",
        "author": {
          "email": "po@zu.tf",
          "company": {
            "domain": "ur.ne"
          },
          "review": [
            {
              "star": 1.7863
            },
            {
              "star": 4.9355
            }
          ]
        }
      }
    ]
  }
}
```

## Let's check the queries excuted
In the backend, 2 queries are executed.
```sh
> nodemon example/index.js

[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node example/index.js`
🚀  Server ready at http://localhost:4000/ 
----------  SEARCH QUERY (Post) ---------
 select "posts"."id" as "id", "posts"."title" as "title", "posts"."id" as "id" from "posts" where "posts"."id" > 1 order by "posts"."id" asc limit 3

----------  SEARCH QUERY (Post) ---------
 select "posts"."id" as "crud_base___id", "authors"."email" as "authors___email", "authors"."id" as "authors___id", "companies"."domain" as "companies___domain", "companies"."id" as "companies___id", "reviews"."star" as "reviews___star", "reviews"."id" as "reviews___id" from "posts" left join "authors" on "posts"."id" = "authors"."id" left join "companies" on "authors"."company_id" = "companies"."id" left join "author_review" on "authors"."id" = "author_review"."author_id" left join "reviews" on "reviews"."id" = "author_review"."review_id" where "posts"."id" in ('2', '3', '4')
 
```