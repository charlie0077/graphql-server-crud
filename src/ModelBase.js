/* eslint-disable no-unused-vars */
const { transformRead, transformReadResult } = require('./knexTransform')
const chalk = require('chalk')
const { asyncForEach, getStringFieldsFromInfo } = require('./utils')
const _ = require('lodash')
const { CONTEXT_KEY, DERIVED_TABLE } = require('./constants')

class ModelBase {
    // this is the actual knex function
    knex = null

    // this can be a table or derived table using query
    table = 'THIS_TABLE_DOES_NOT_EXIST'

    // fields
    fields = {}

    // this specify what kind of query and mutation to be built
    queryToGenerate = ['INSERT', 'DELETE', 'UPDATE', 'GET', 'QUERY', 'BULK_INSERT', 'BULK_UPDATE', 'BULK_DELETE']

    // default limit and offset
    maxLimit = 1000
    defaultLimit = 500
    defaultOffset = 0

    // timeout config
    timeout = 60000

    // setting this to true enables query dump
    knexDebug = false

    // logger
    logger = console.log

    // color mappings for logger
    colorMapping = {
      GET: '#52BE80',
      SEARCH: '#48C9B0',
      INSERT: '#7FB3D5',
      UPDATE: '#F7DC6F',
      DELETE: '#F1948A',
      BULK_INSERT: '#7FB3D5',
      BULK_UPDATE: '#F7DC6F',
      BULK_DELETE: '#F1948A'
    }

    searchQuery (args, context) {
      let sql = this.knexE()
      // add limit and offset
      const { limit, offset } = this.getLimitOffset(args)
      sql = transformRead(sql, args, limit, offset, context[CONTEXT_KEY], this)
      return sql
    }

    async query (args, context) {
      const sql = this.searchQuery(args, context)
      return this.executeQuery(sql, 'SEARCH', args, context)
    }

    async get (args, context) {
      args.where = { id: { eq: args.id } }
      args.limit = 1
      args.offset = 0

      const sql = this.searchQuery(args, context)
      return this.executeQuery(sql, 'GET', args, context)
    }

    async insert (args, context) {
      let sql = this.knexE()
      sql = sql.insert(args.data)

      return this.executeQuery(sql, 'INSERT', args, context)
    }

    async bulkInsert (args, context) {
      let sql = this.knexE()
      sql = sql.insert(args.data)

      return this.executeQuery(sql, 'BULK_INSERT', args, context)
    }

    async update (args, context) {
      let sql = this.knexE()
      sql = sql.where('id', args.data.id).update(args.data)

      return this.executeQuery(sql, 'UPDATE', args, context)
    }

    async bulkUpdate (args, context) {
      // TODO: need to make it one query and better error status/handling
      const res = []
      await asyncForEach(args.data, async each => {
        const arg = { data: each }
        const resEach = await this.update(arg, context)
        res.push(resEach)
      })
      return res
    }

    async delete (args, context) {
      let sql = this.knexE()
      sql = sql.where('id', args.data.id).delete()
      return this.executeQuery(sql, 'DELETE', args, context)
    }

    async bulkDelete (args, context) {
      let sql = this.knexE()
      const ids = args.data.map(x => x.id)
      sql = sql.whereIn('id', ids).delete()

      return this.executeQuery(sql, 'BULK_DELETE', args, context)
    }

    async executeQuery (sql, type, args, context) {
      this.addReturning(sql, type, args)

      if (this.knexDebug) {
        const chalkFormat = chalk.hex(this.colorMapping[type])
        const message = chalkFormat(`----------  ${type} QUERY (${this.constructor.name}) ---------\n ${sql.toString()}\n`)
        this.logger(message)
      }

      let res = await sql
      if (['GET', 'SEARCH'].includes(type)) {
        res = transformReadResult(res, args, context[CONTEXT_KEY])
      }

      if (type.includes('SEARCH') || type.includes('BULK')) {
        return res
      } else {
        return res[0]
      }
    }

    addReturning (sql, type, args) {
      const returning = !['GET', 'QUERY'].includes(type)
      if (returning) {
        const returnFields = getStringFieldsFromInfo(args.parsedResolveInfo).map(field => field.name)
        if (returnFields.length > 0) { sql = sql.returning(returnFields) }
      }
    }

    knexE () {
      this.checkKnex()

      let knex = null
      if (this.table.split(' ').length === 1) {
        knex = this.knex(this.table)
      } else {
        knex = this.knex.with(DERIVED_TABLE, this.knex.raw(this.table)).from(DERIVED_TABLE)
        // knex = this.knex.queryBuilder().from(this.knex.raw('(' + this.table + ') as RAW_QUERY_GENERATED'))
      }

      if (this.timeout) {
        knex = knex.timeout(this.timeout, { cancel: true })
      }

      return knex
    }

    baseTable () {
      if (this.table.split(' ').length === 1) {
        return this.table
      } else {
        return DERIVED_TABLE
      }
    }

    checkKnex () {
      /* istanbul ignore if  */
      if (this.knex === null) {
        const chalkFormat = chalk.hex('#FF0000')
        const message = chalkFormat('Error: knex passed to the model should not be null. Please set it in your model.')
        throw new Error('Knex should not be null.')
      }
    }

    getLimitOffset (args) {
      let limit = this.defaultLimit
      if ((args.limit !== undefined) && (args.limit !== null)) {
        limit = args.limit
      }
      limit = Math.min(this.maxLimit, limit)

      let offset = this.defaultOffset
      if ((args.offset !== undefined) && (args.offset !== null)) {
        offset = args.offset
      }

      return { limit, offset }
    }

    async before (args, context, info) {}

    async after (args, context, info) {}
}

module.exports = ModelBase
