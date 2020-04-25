const knexConfig = {
  client: 'postgresql',
  connection: {
    host: 'localhost',
    user: 'test',
    password: 'test',
    database: 'test',
    port: process.env.POSTGRESQL_PORT || 6666
  },
  pool: {
    min: 1,
    max: 2
  },
  migrations: {
    tableName: 'knex_migrations'
  }
}

module.exports = {
  development: knexConfig,
  test: knexConfig,
  example: knexConfig
}
