# Introduction

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
    limit: 5
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
        "author": {
          "email": "wicisu@sefnevpur.si",
          "company": {
            "domain": "wofizrak.ke"
          }
        }
      },
      {
        "id": 3,
        "title": "Ipnek bacepos di pen subnuran paheog duhnab cihonzi.",
        "author": {
          "email": "novme@pocogov.sb",
          "company": {
            "domain": "vafdose.gb"
          }
        }
      },
      {
        "id": 4,
        "title": "Odovo gezde catug leogdu fino jag tikih jailho.",
        "author": {
          "email": "fop@dek.bs",
          "company": {
            "domain": "vazili.ws"
          }
        }
      },
      {
        "id": 5,
        "title": "Ado dogva ricab tupbaobe ir me rosgekpag eroberogi.",
        "author": null
      },
      {
        "id": 6,
        "title": "Cuckoboz dijjujat zovucini ikle nog ube ahuvohaf ujane.",
        "author": {
          "email": "zoc@cowibgeh.cz",
          "company": null
        }
      }
    ]
  }
}
```

## Let's check the queries excuted
In the backend, only 2 queries is executed. N+1 problem is not an issue in the library.
```sh
> nodemon example/index.js

[nodemon] 2.0.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching dir(s): *.*
[nodemon] watching extensions: js,mjs,json
[nodemon] starting `node example/index.js`
🚀  Server ready at http://localhost:4000/ 
----------  SEARCH QUERY (Post) ---------
 select "posts"."id" as "id", "posts"."title" as "title", "posts"."id" as "id" from "posts" where "posts"."id" > 1 order by "posts"."id" asc limit 5

----------  SEARCH QUERY (Post) ---------
 select "posts"."id" as "crud_base___id", "authors"."email" as "authors___email", "authors"."id" as "authors___id", "companies"."domain" as "companies___domain", "companies"."id" as "companies___id" from "posts" left join "authors" on "posts"."author_id" = "authors"."id" left join "companies" on "authors"."company_id" = "companies"."id" where "posts"."id" in (2, 3, 4, 5, 6)

```