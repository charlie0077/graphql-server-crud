const Chance = require('chance')
const chance = new Chance(0)

async function createTable (knex) {
  const queries = [
    'DROP TABLE IF EXISTS "companies";',
    `CREATE TABLE companies (
      id bigint PRIMARY KEY,
      domain text,
      public boolean,
      phone text,
      sales float,
      customers bigint
    );`,
    'DROP TABLE IF EXISTS "authors";',
    `CREATE TABLE authors (
      id bigint PRIMARY KEY,
      company_id bigint,
      first_name text,
      last_name text,
      email text,
      age bigint,
      salary float
    );`,
    'DROP TABLE IF EXISTS "posts";',
    `CREATE TABLE posts (
      id bigint PRIMARY KEY,
      author_id bigint,
      title text,
      public boolean,
      clicks bigint,
      score float
    );`,
    'DROP TABLE IF EXISTS "reviews";',
    `CREATE TABLE reviews (
      id bigint PRIMARY KEY,
      star float,
      content text
    );`,
    'DROP TABLE IF EXISTS "author_review";',
    `CREATE TABLE author_review (
      id bigint PRIMARY KEY,
      author_id bigint,
      review_id bigint
    );`
  ]

  for (let i = 0; i < queries.length; i++) {
    await knex.raw(queries[i])
  }
}

async function seedCompany (knex) {
  for (let id = 0; id < 10; id++) {
    await knex.raw(`
      INSERT INTO
      "companies" (
        "id",
        "domain",
        "public",
        "phone",
        "sales",
        "customers"
      )
    VALUES
      (
        ${id},
        '${chance.domain()}',
        ${chance.bool()},
        '${chance.phone()}',
        ${chance.floating({ min: -10000, max: 10000 })},
        ${chance.integer({ min: 0, max: 20 })}
      );
    `)
  }
}

async function seedAuthors (knex) {
  for (let id = 0; id < 30; id++) {
    await knex.raw(`
      INSERT INTO
      "authors" (
        "id",
        "company_id",
        "first_name",
        "last_name",
        "email",
        "age",
        "salary"
      )
    VALUES
      (
        ${id},
        ${id / 2 + chance.integer({ min: 0, max: 2 })},
        '${chance.name({ nationality: 'en' }).replace('\'', '')}',
        '${chance.name({ nationality: 'en' }).replace('\'', '')}',
        '${chance.email()}',
        ${chance.integer({ min: 0, max: 70 }) + 20},
        ${chance.floating({ min: 100, max: 10000 })}
      );
    `)
  }

  // create some null edge cases
  await knex.raw(`
    update
    authors
    set company_id = null
    where id in ('3', '7')
  `)
}

async function seedPosts (knex) {
  for (let id = 0; id < 100; id++) {
    await knex.raw(`
      INSERT INTO
      "posts" (
        "id",
        "author_id",
        "title",
        "public",
        "clicks",
        "score"
      )
    VALUES
      (
        ${id},
        ${id / 3 + chance.integer({ min: 0, max: 10 })},
        '${chance.sentence({ words: 8 }).replace('\'', '')}',
        ${chance.bool()},
        ${chance.integer({ min: 0, max: 70 })},
        ${chance.floating({ min: 0, max: 700 })}
      );
    `)
  }
  // create some null edge cases
  await knex.raw(`
    update
    posts
    set author_id = null
    where id in ('5', '10', '15', '20')
  `)
}

async function seedReviews (knex) {
  for (let id = 0; id < 100; id++) {
    await knex.raw(`
      INSERT INTO
      "reviews" (
        "id",
        "star",
        "content"
      )
    VALUES
      (
        ${id},
        ${chance.floating({ min: 0, max: 5 })},
        '${chance.sentence({ words: 8 }).replace('\'', '')}'
      );
    `)
  }
}

async function seedAuthorReview (knex) {
  for (let id = 0; id < 100; id++) {
    await knex.raw(`
      INSERT INTO
      "author_review" (
        "id",
        "author_id",
        "review_id"
      )
    VALUES
      (
        ${id},
        ${id / 3 + chance.integer({ min: 0, max: 10 })},
        ${id / 3 + chance.integer({ min: 0, max: 10 })}
      );
    `)
  }
}

exports.seed = async (knex) => {
  await createTable(knex)
  await seedCompany(knex)
  await seedAuthors(knex)
  await seedPosts(knex)
  await seedReviews(knex)
  await seedAuthorReview(knex)
}
