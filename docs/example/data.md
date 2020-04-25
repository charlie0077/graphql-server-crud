# Test tables and data

Tables are created and fake data are inserted when you run the **"npm run seed"** command. You can find the whole data seed file [here](https://github.com/charlie0077/graphql-server-crud/blob/master/example/seeds/data.js). 

Whenever you rerun the **"npm run seed"**, the tables will be recreated and data will be reinserted.

## Tables
This is the table schema:

<img :src="$withBase('/table-schema.png')">

*Diagram is generated from [dbdiagram](https://dbdiagram.io/d)*

<!-- 
Graph generated from: https://dbdiagram.io/d
Table companies {
    id int [pk, increment]
    country_id int
    domain text
    public boolean
    phone text
    sales float
    customers int
}

Table authors {
  id int [pk]
    company_id int
    first_name text
    last_name text
    email text
    age int
    salary float
    active boolean
}


Table countries {
  id int [pk]
  name text
 }
 

Table posts {
  id int [pk]
  author_id int
  title text
  public boolean
  clicks int
  score float
}


Table reviews {
  id int [pk]
  star float
  content text
}


Table author_review {
  id int [pk]
  author_id int
  review_id int
}


Ref: companies.country_id > countries.id
Ref: authors.company_id > companies.id
Ref: posts.author_id > authors.id
Ref: author_review.author_id > authors.id
Ref: author_review.review_id > reviews.id 
-->


::: tip
Notice that foreign key constraint is not actually enforced when tables are really created. This is intentional in the example to demo some **null** cases.
:::


## Data
[chance](https://www.npmjs.com/package/chance) is used to generate the fake data. 

Here are some high level information about the data:
* 10 countries are created.
* 20 companies are created.
* 50 authors are created.
* 200 posts are created.
* 200 reviews are created.
* 200 author-review *"many to many"* relations are created.
* Some author may not have company_id; some post may not have author_id. This is intentional to test null case.
* Some company may have multiple authors; some author may have multiple posts.
