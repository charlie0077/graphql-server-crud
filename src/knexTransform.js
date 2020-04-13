const _ = require('lodash')
const { addOrCreate, swapKeyValue, getStringFieldsFromInfo, getModelFieldsFromInfo } = require('./utils')
const { BASE_TABLE } = require('./constants')

const OR_SYMBOL = '_or'
const AND_SYMBOL = '_and'
const JOIN_TABLE_SEPARATOR = '___'

const onMethodMapping = {
  in: 'onIn',
  nin: 'onNotIn',
  between: 'onBetween',
  nbetween: 'onNotBetween',
  default: 'on'
}

const methodMapping = {
  in: 'whereIn',
  nin: 'whereNotIn',
  between: 'whereBetween',
  nbetween: 'whereNotBetween',
  default: 'where'
}

const orMethodMapping = {
  in: 'orWhereIn',
  nin: 'orWhereNotIn',
  between: 'orWhereBetween',
  nbetween: 'orWhereNotBetween',
  default: 'orWhere'
}

function operatorMap (opr) {
  const mapping = {
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<=',
    eq: '=',
    ne: '<>',
    is: 'is',
    nis: 'is not'
  }

  const oprLower = opr.toLowerCase()
  if (!Object.keys(mapping).includes(oprLower)) {
    throw Error(`Not supported operator: ${opr}`)
  }

  return mapping[oprLower]
}

function addWhere (selection, query, relation, table) {
  if (_.isNil(query)) {
    return
  }

  const andRelation = (relation !== OR_SYMBOL)

  const entries = Object.entries(query)

  // process normal fields
  entries.forEach(entry => {
    const col = entry[0]
    if ([AND_SYMBOL, OR_SYMBOL].includes(col)) {
      return
    }

    const expr = entry[1]
    const exprEntry = Object.entries(expr)[0]
    if (Object.keys(methodMapping).includes(exprEntry[0])) {
      const method = andRelation ? methodMapping[exprEntry[0]] : orMethodMapping[exprEntry[0]]
      selection = selection[method](`${table}.${col}`, exprEntry[1])
    } else {
      const method = andRelation ? 'where' : 'orWhere'
      selection = selection[method](`${table}.${col}`, operatorMap(exprEntry[0]), exprEntry[1])
    }
  })

  // process AND
  if (Object.keys(query).includes(AND_SYMBOL)) {
    const subQueries = query[AND_SYMBOL]
    subQueries.forEach(function (each) {
      selection = selection.where(function () {
        addWhere(this, each, AND_SYMBOL, table)
      })
    })
  }

  // process OR
  if (Object.keys(query).includes(OR_SYMBOL)) {
    const subQueries = query[OR_SYMBOL]
    subQueries.forEach(function (each) {
      selection = selection.orWhere(function () {
        // default to AND
        addWhere(this, each, AND_SYMBOL, table)
      })
    })
  }
}

function addOn (selection, query, table) {
  if (_.isNil(query)) {
    return
  }

  const entries = Object.entries(query)

  // process normal fields
  entries.forEach(entry => {
    const col = entry[0]
    // AND and OR SYMBOL are ignored in on
    if ([AND_SYMBOL, OR_SYMBOL].includes(col)) {
      return
    }

    const expr = entry[1]
    const exprEntry = Object.entries(expr)[0]

    if (Object.keys(onMethodMapping).includes(exprEntry[0])) {
      const method = onMethodMapping[exprEntry[0]]
      selection = selection[method](`${table}.${col}`, exprEntry[1])
    } else {
      const method = 'on'
      selection = selection[method](`${table}.${col}`, operatorMap(exprEntry[0]), exprEntry[1])
    }
  })
}

function where (selection, query, table) {
  // default to AND
  addWhere(selection, query, AND_SYMBOL, table)
}

function groupBy (selection, query, table) {
  if (_.isNil(query)) {
    return
  }

  query.forEach(entry => {
    selection = selection.groupBy(`${table}.${entry}`)
  })
}

function having (selection, query, knex, table) {
  if (_.isNil(query)) {
    return
  }

  const entries = Object.entries(query)
  entries.forEach(entry => {
    let col = entry[0]
    const expr = entry[1]
    const exprEntry = Object.entries(expr)[0]

    if (col.includes('__')) {
      const splits = col.split('__')
      col = knex.raw(`${splits[1]}("${table}"."${splits[0]}")`)
    } else {
      col = `${table}.${col}`
    }

    if (exprEntry[0] === 'in') {
      selection = selection.havingIn(col, exprEntry[1])
    } else if (exprEntry[0] === 'nin') {
      selection = selection.havingNotIn(col, exprEntry[1])
    } else if (exprEntry[0] === 'between') {
      selection = selection.havingBetween(col, exprEntry[1])
    } else if (exprEntry[0] === 'nbetween') {
      selection = selection.havingNotBetween(col, exprEntry[1])
    } else {
      selection = selection.having(col, operatorMap(exprEntry[0]), exprEntry[1])
    }
  })
}

function getFields (parsedResolveInfo, knex, table) {
  const stringFields = getStringFieldsFromInfo(parsedResolveInfo)
  const fields = stringFields.map(field => field.name)

  const res = fields.map(field => {
    if (field.includes('__')) {
      const splits = field.split('__')
      if (field.includes('__count_distinct')) {
        return knex.raw(`count(distinct "${table}"."${splits[0]}") as ${BASE_TABLE}${JOIN_TABLE_SEPARATOR}${field}`)
      } else {
        return knex.raw(`${splits[1]}("${table}"."${splits[0]}") as ${BASE_TABLE}${JOIN_TABLE_SEPARATOR}${field}`)
      }
    } else {
      return `${table}.${field} as ${BASE_TABLE}${JOIN_TABLE_SEPARATOR}${field}`
    }
  })

  return res
}

function join (sql, context, model, parsedResolveInfo) {
  const modelFields = getModelFieldsFromInfo(parsedResolveInfo)
  modelFields.forEach(modelField => {
    const modelFieldName = modelField.name
    const fieldModel = context.modelInstancesMapping[modelFieldName]
    const tableName = fieldModel.table
    const joinHint = model.fields[modelFieldName]
    const joinMethod = modelField.args.joinType || 'join'
    if (!['join', 'leftJoin', 'rightJoin', 'fullOuterJoin', 'crossJoin'].includes(joinMethod)) {
      throw new Error(`Invalid join type: ${joinMethod}`)
    }

    if (joinHint.through) {
      sql = sql[joinMethod](joinHint.through.from.split('.')[0], function () {
        this.on(joinHint.from, '=', joinHint.through.from)
      })

      sql = sql[joinMethod](tableName, function () {
        this.on(joinHint.to, '=', joinHint.through.to)
        addOn(this, modelField.args.on, tableName)
      })
    } else {
      sql = sql[joinMethod](tableName, function () {
        this.on(joinHint.from, '=', joinHint.to)
        addOn(this, modelField.args.on, tableName)
      })
    }

    // select string fields of this layer
    const stringFields = getStringFieldsFromInfo(modelField)
    // add id filed so that is easy to infer later
    stringFields.push({ name: 'id' })
    stringFields.forEach(stringField => {
      const colName = stringField.name
      sql = sql.select(`${tableName}.${colName} as ${tableName}${JOIN_TABLE_SEPARATOR}${colName}`)
    })
    // join the next layer
    join(sql, context, fieldModel, modelField)
  })
}

function transformRead (sql, args, limit, offset, knex, context, model) {
  const table = model.baseTable()
  sql = sql.limit(limit)
  sql = sql.offset(offset)

  // add order by
  if (args.orderBy) {
    args.orderBy.forEach(each => {
      if (each.order) {
        sql = sql.orderBy(`${table}.${each.column}`, each.order)
      } else {
        sql = sql.orderBy(`${table}.${each.column}`)
      }
    })
  }

  const fields = getFields(args.parsedResolveInfo, knex, table)
  if (fields) {
    sql = sql.select(fields)
  }

  if (args.distinct) {
    sql = sql.distinct()
  }

  join(sql, context, model, args.parsedResolveInfo)
  where(sql, args.where, table)
  groupBy(sql, args.groupBy, table)
  having(sql, args.having, knex, table)

  return sql
}

function getTableNames (res) {
  const names = new Set()
  if (res.length !== 0) {
    const keys = Object.keys(res[0])
    keys.forEach(each => {
      if (each.includes(JOIN_TABLE_SEPARATOR)) {
        names.add(each.split(JOIN_TABLE_SEPARATOR)[0])
      }
    })
  }

  return names
}

function buildModelResultMapping (res, parentChild, fieldTableMapping) {
  const tableNames = getTableNames(res)
  const tableFieldMapping = swapKeyValue(fieldTableMapping)

  const mapping = {}
  tableNames.forEach(tableName => {
    mapping[tableFieldMapping[tableName]] = {}
  })

  const ids = {}
  parentChild.forEach(each => {
    const [parent, child] = each
    ids[parent] = ids[parent] || {}
    ids[parent][child] = {}
  })

  res.forEach(each => {
    const idMapping = {}

    tableNames.forEach(tableName => {
      const id = each[`${tableName}${JOIN_TABLE_SEPARATOR}id`]
      mapping[tableFieldMapping[tableName]][id] = {}
      idMapping[tableName] = id
    })

    parentChild.forEach((each) => {
      const [parent, child] = each
      const parentId = idMapping[fieldTableMapping[parent]]
      const childId = idMapping[fieldTableMapping[child]]
      if (parentId !== null && childId !== null) {
        ids[parent][child][parentId] = addOrCreate(ids[parent][child][parentId], childId)
      }
    })

    for (const key in each) {
      if (key.includes(JOIN_TABLE_SEPARATOR)) {
        const keyTableName = key.split(JOIN_TABLE_SEPARATOR)[0]
        const keyColumnName = key.split(JOIN_TABLE_SEPARATOR)[1]
        mapping[tableFieldMapping[keyTableName]][idMapping[keyTableName]][keyColumnName] = each[key]
      }
    }
  })

  // convert ids leaf node from set to array
  for (const parent in ids) {
    for (const child in ids[parent]) {
      for (const id in ids[parent][child]) {
        ids[parent][child][id] = Array.from(ids[parent][child][id])
      }
    }
  }

  return { mapping, ids }
}

function getParentChild (parsedResolveInfo) {
  function dfs (parentChild, current, parsedResolveInfo) {
    const modelFields = getModelFieldsFromInfo(parsedResolveInfo)
    modelFields.forEach(field => {
      parentChild.add([current, field.name])
      dfs(parentChild, field.name, field)
    })
  }

  const parentChild = new Set()
  dfs(parentChild, BASE_TABLE, parsedResolveInfo)
  return parentChild
}

function fillNestedValue (current, res, modelResultMapping, parsedResolveInfo) {
  const ids = modelResultMapping.ids
  const objects = modelResultMapping.mapping
  const modelFields = getModelFieldsFromInfo(parsedResolveInfo)
  modelFields.forEach(field => {
    const child = field.name
    res.forEach(record => {
      record[child] = ids[current][child][record.id]
      if (!_.isNil(record[child])) {
        record[child] = record[child].map(id => objects[child][id])
        fillNestedValue(child, record[child], modelResultMapping, field)
      }
    })
  })
}

function buildFiledTableMapping (context) {
  const mapping = {}
  mapping[BASE_TABLE] = BASE_TABLE
  for (const name in context.modelInstancesMapping) {
    mapping[name] = context.modelInstancesMapping[name].table
  }
  return mapping
}

function saveOrders (res) {
  const orders = new Set()
  res.forEach(each => {
    orders.add(each[`${BASE_TABLE}___id`])
  })
  return Array.from(orders)
}

function transformReadResult (res, args, context) {
  if (res.length === 0) return res
  const orders = saveOrders(res)
  const parentChild = getParentChild(args.parsedResolveInfo)
  const fieldTableMapping = buildFiledTableMapping(context)
  const modelResultMapping = buildModelResultMapping(res, parentChild, fieldTableMapping)
  res = orders.map(id => modelResultMapping.mapping[BASE_TABLE][id])
  fillNestedValue(BASE_TABLE, res, modelResultMapping, args.parsedResolveInfo)
  return res
}

module.exports = { transformRead, transformReadResult }
