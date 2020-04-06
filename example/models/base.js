// const { ModelBase } = require('graphql-server-crud')
// I am using the src for my quick local test, you may want to switch to use the line above
const { ModelBase } = require('../../src')

const { knex } = require('../db')

class Base extends ModelBase {
  knex = knex
  knexDebug = true
  logger = console.log

  // default limit and offset
  maxLimit = 100
  defaultLimit=50
  defaultOffset = 0

  // configure query timeout
  timeout = 1000
}

module.exports = { Base }
