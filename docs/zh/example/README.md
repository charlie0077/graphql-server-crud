# 介绍

There is an [example project](https://github.com/charlie0077/graphql-server-crud/tree/master/example) for you to play with. 

## Setup

### Launch database
```sh
cd example/database
docker-compose up # this will launch the database
```

The user name, password, database are all **_"test"_**; port number is **_6666_**. 

You can also use your own database instead of this docker. In that case, remember to update the database configuration [here](https://github.com/charlie0077/graphql-server-crud/blob/master/example/knexfile.js#L6-L9).


### Launch grapqhql api server
```sh
cd example
npm install
npm run seed # this will seed the data
npm start
```
::: warning 
COMPATIBILITY NOTE: This example code requires Node.js >= 12.
:::

You should be able to access the graphql playground on [http://localhost:4000/](http://localhost:4000/)

## Try query in the playground
Run the following graphql query. 
```graphql
query {
  queryPost(
    where: { id: { gt: 1 } }
    offset: 0
    limit: 3
    orderBy: { column: "id", order: "asc" }
  ) {
    id
    title
    author {
      email
      company {
        domain
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
        "title": "new post 2222",
        "author": [
          {
            "email": "ur@moej.wf",
            "company": [
              {
                "domain": "nouco.cn"
              }
            ]
          }
        ]
      },
      {
        "id": 3,
        "title": "Gokgor kezli lazgoh gaw nite mewseun do supma.",
        "author": [
          {
            "email": "vilurazu@vuse.tk",
            "company": [
              {
                "domain": "nitdopfiz.ro"
              }
            ]
          }
        ]
      },
      {
        "id": 4,
        "title": "Totunusa kazaha ruguk di zuvon mojfogow datiha ewa.",
        "author": [
          {
            "email": "ur@moej.wf",
            "company": [
              {
                "domain": "nouco.cn"
              }
            ]
          }
        ]
      }
    ]
  }
}
```

## Let's check the queries excuted
In the backend, only 1 queries is executed.
We will explain more details about how N+1 problems is avoided in the library.
```sh
> nodemon example/index.js

[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node example/index.js`
🚀  Server ready at http://localhost:4000/ 
----------  SEARCH QUERY (Post) ---------
 select "posts"."id" as "crud_base___id", "posts"."title" as "crud_base___title", "posts"."author_id" as "crud_base___author_id", "authors"."email" as "authors___email", "authors"."id" as "authors___id", "companies"."domain" as "companies___domain", "companies"."id" as "companies___id" from "posts" left join "authors" on "posts"."author_id" = "authors"."id" left join "companies" on "authors"."company_id" = "companies"."id" where "posts"."id" > 1 order by "posts"."id" asc limit 3
```