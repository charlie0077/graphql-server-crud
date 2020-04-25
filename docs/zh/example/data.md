# 测试数据

Three tables are created and fake data are inserted when you run the **"npm run seed"** command. You can find the whole data seed file [here](https://github.com/charlie0077/graphql-server-crud/blob/master/example/seeds/data.js). 

Whenever you rerun the **"npm run seed"**, the tables will be recreated and data will be reinserted.

## Tables
### Company
Here is the DDL for it.
```sql
CREATE TABLE companies (
    id bigint PRIMARY KEY,
    domain text,
    public boolean,
    phone text,
    sales double precision,
    customers bigint
);
```

### Author
Here is the DDL for it.
```sql
CREATE TABLE authors (
    id bigint PRIMARY KEY,
    company_id bigint,
    first_name text,
    last_name text,
    email text,
    age bigint,
    salary double precision
);
```
::: tip
Notice that foreign key constraint on the **company_id** column is not created. This is intentional in the example to demo some **null** cases.
:::

### Post
Here is the DDL for it.
```sql
CREATE TABLE posts (
    id bigint PRIMARY KEY,
    author_id bigint,
    title text,
    public boolean,
    clicks bigint,
    score double precision
);
```
::: tip
Notice that foreign key constraint on the **author_id** column is not created. This is intentional in the example to demo some **null** cases.
:::


## Data
We are using the [faker](https://www.npmjs.com/package/faker) library to generate fake data. 

Here are some high level information about the data:

* 10 companies are created.
* 30 authors are created.
* 100 posts are created.
* Some author may not have company_id; some post may not have author_id. This is intentional to test null case.
* Some company may have multiple authors; some author may have multiple posts.
