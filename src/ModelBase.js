/* eslint-disable no-unused-vars */
const { transformRead } = require('./knexTransform')
const chalk = require('chalk')
const { asyncForEach } = require('./utils')
const _ = require('lodash')
const { CONTEXT_KEY } = require('./constants')

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

    // color mappings for logger
    colorMapping = {
      GET: '#52BE80',
      LIST: '#48C9B0',
      INSERT: '#7FB3D5',
      UPDATE: '#F7DC6F',
      DELETE: '#F1948A',
      BULK_INSERT: '#7FB3D5',
      BULK_UPDATE: '#F7DC6F',
      BULK_DELETE: '#F1948A'
    }

    listQuery (args) {
      let sql = this.knexE()
      // add limit and offset
      const { limit, offset } = this.getLimitOffset(args)
      sql = transformRead(sql, args, limit, offset, this.knex)
      return sql
    }

    async query (args, context) {
      const sql = this.listQuery(args)
      return this.executeQuery(sql, 'LIST', args, context)
    }

    async get (args, context) {
      args.where = { id: { eq: args.id } }
      args.limit = 1
      args.offset = 0

      const sql = this.listQuery(args)
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
        const arg = {
          data: each,
          selectedFields: args.selectedFields
        }
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

      const res = await sql
      await this.addModelFields(res, args, context)

      if (type.includes('LIST') || type.includes('BULK')) {
        return res
      } else {
        return res[0]
      }
    }

    addReturning (sql, type, args) {
      const returning = !['GET', 'QUERY'].includes(type)
      if (returning) {
        const returnFields = this.getSelectedFieldsString(args)
        if (returnFields.length > 0) { sql = sql.returning(returnFields) }
      }
    }

    async addModelFields (res, args, context) {
      const modelFields = this.getSelectedFieldsModel(args)
      await asyncForEach(modelFields, async fieldName => {
        const fieldIdName = this.fields[fieldName].toLowerCase() + '_id'
        const resIds = res.map(each => (each[fieldIdName])).filter(x => !_.isNil(x))
        const dedupIds = _.union(resIds)

        const newArgFields = args.selectedFields[fieldName]
        newArgFields.id = 'id'

        const modelQueryArgs = {
          where: { id: { in: dedupIds } },
          selectedFields: newArgFields,
          limit: dedupIds.length,
          offset: 0
        }
        const modelInstance = context[CONTEXT_KEY].modelInstancesMapping[fieldName]
        await modelInstance.before()
        const temp = await modelInstance.query(modelQueryArgs, context)
        await modelInstance.after()

        const tempMap = {}
        temp.forEach(each => {
          tempMap[each.id] = each
        })

        res.forEach(each => {
          each[fieldName] = _.isNil(each[fieldIdName]) ? null : tempMap[each[fieldIdName]]
        })
      })
    }

    knexE () {
      this.checkKnex()

      let knex = null
      if (this.table.split(' ').length === 1) {
        knex = this.knex(this.table)
      } else {
        knex = this.knex.queryBuilder().from(this.knex.raw('(' + this.table + ') as RAW_QUERY_GENERATED'))
      }

      if (this.timeout) {
        knex = knex.timeout(this.timeout, { cancel: true })
      }

      return knex
    }

    checkKnex () {
      if (this.knex === null) {
        const chalkFormat = chalk.hex('#FF0000')
        const message = chalkFormat('Error: knex passed to the model should not be null. Please set it in your model.')
        console.log(message)
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

    logger (message) {
      console.log(message)
    }

    async before (args, context, info) {}

    async after (args, context, info) {}

    getSelectedFieldsString (args) {
      const fields = []
      for (const each in args.selectedFields) {
        if ((typeof args.selectedFields[each]) === 'string') {
          fields.push(each)
        }
      }
      return fields
    }

    getSelectedFieldsModel (args) {
      const fields = []
      for (const each in args.selectedFields) {
        if ((typeof args.selectedFields[each]) !== 'string') {
          fields.push(each)
        }
      }
      return fields
    }
}

module.exports = ModelBase
