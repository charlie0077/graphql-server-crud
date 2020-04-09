module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      user: 'test',
      password: 'test',
      database: 'test',
      port: 6666
    },
    pool: {
      min: 1,
      max: 2
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  test: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      user: 'test',
      password: 'test',
      database: 'test',
      port: 6666
    },
    pool: {
      min: 1,
      max: 2
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

}
