const _ = require('lodash')
const { addOrCreate, swapKeyValue } = require('./utils')
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

const havingMethodMapping = {
  in: 'havingIn',
  nin: 'havingNotIn',
  between: 'havingBetween',
  nbetween: 'havingNotBetween',
  default: 'having'
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
    eq: '=',
    ne: '<>',
    gt: '>',
    gte: '>=',
    lt: '<',
    lte: '<='
  }

  const oprLower = opr.toLowerCase()
  /* istanbul ignore if  */
  if (!Object.keys(mapping).includes(oprLower)) {
    throw Error(`Not supported operator: ${opr}`)
  }

  return mapping[oprLower]
}

// TODO: clean up code here
function addWhere (selection, query, relation, table, model) {
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

    if (_.isObjectLike(model.fields[col])) {
      // process nested field condition
      joinWhere(selection, model.modelInstancesMapping, model.fields[col], entry[0], entry[1])
      return
    }

    const expr = entry[1]
    const exprEntry = Object.entries(expr)[0]
    if (exprEntry[0] === 'null') {
      if (exprEntry[1]) {
        const method = andRelation ? 'whereNull' : 'orWhereNull'
        selection = selection[method](`${table}.${col}`)
      } else {
        const method = andRelation ? 'whereNotNull' : 'orWhereNotNull'
        selection = selection[method](`${table}.${col}`)
      }
    } else if (Object.keys(methodMapping).includes(exprEntry[0])) {
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
        addWhere(this, each, AND_SYMBOL, table, model)
      })
    })
  }

  // process OR
  if (Object.keys(query).includes(OR_SYMBOL)) {
    const subQueries = query[OR_SYMBOL]
    subQueries.forEach(function (each) {
      selection = selection.orWhere(function () {
        // default to AND
        addWhere(this, each, AND_SYMBOL, table, model)
      })
    })
  }
}

function joinWhere (sql, modelInstancesMapping, joinHint, fieldName, fieldValue) {
  const fieldModel = modelInstancesMapping[fieldName]
  const tableName = fieldModel.table
  const joinMethod = 'innerJoin'

  const onFiledValue = _.pickBy(fieldValue, (value, key) => !_.isObjectLike(fieldModel.fields[key]))
  addJoin(sql, joinMethod, joinHint, onFiledValue, tableName)

  const nestedFiledValue = _.pickBy(fieldValue, (_value, key) => _.isObjectLike(fieldModel.fields[key]))
  for (const each in nestedFiledValue) {
    joinWhere(sql, modelInstancesMapping, fieldModel.fields[each], each, nestedFiledValue[each])
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
    const expr = entry[1]
    const exprEntry = Object.entries(expr)[0]

    if (exprEntry[0] === 'null') {
      if (exprEntry[1]) {
        selection = selection.onNull(`${table}.${col}`)
      } else {
        selection = selection.onNotNull(`${table}.${col}`)
      }
    } else if (Object.keys(onMethodMapping).includes(exprEntry[0])) {
      const method = onMethodMapping[exprEntry[0]]
      selection = selection[method](`${table}.${col}`, exprEntry[1])
    } else {
      selection = selection.on(`${table}.${col}`, operatorMap(exprEntry[0]), exprEntry[1])
    }
  })
}

function where (selection, where, table, model) {
  // default to AND
  addWhere(selection, where, AND_SYMBOL, table, model)
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

    if (exprEntry[0] === 'null') {
      if (exprEntry[1]) {
        selection = selection.havingNull(col)
      } else {
        selection = selection.havingNotNull(col)
      }
    } else if (Object.keys(havingMethodMapping).includes(exprEntry[0])) {
      const method = havingMethodMapping[exprEntry[0]]
      selection = selection[method](col, exprEntry[1])
    } else {
      selection = selection.having(col, operatorMap(exprEntry[0]), exprEntry[1])
    }
  })
}

function getFields (args, model, table) {
  const fields = args.select

  // select uniqueColumn if there is nested objects
  if (!_.isEmpty(args.include)) {
    fields.push(model.uniqueColumn)
  }

  const res = fields.map(field => {
    if (field.includes('__')) {
      const splits = field.split('__')
      if (field.includes('__count_distinct')) {
        return model.knex.raw(`count(distinct "${table}"."${splits[0]}") as ${field}`)
      } else {
        return model.knex.raw(`${splits[1]}("${table}"."${splits[0]}") as ${field}`)
      }
    } else {
      return `${table}.${field} as ${field}`
    }
  })

  return res
}

function transformRead (sql, args, limit, offset, model) {
  const table = model.baseTable()
  // TODO: fix this; it does not work when multiple query running
  model.modelInstancesMapping[BASE_TABLE] = model
  sql = sql.limit(limit)
  sql = sql.offset(offset)

  // add order by
  if (args.orderBy) {
    args.orderBy.forEach(each => {
      const order = each.order || 'asc'
      let col = each.column
      if (col.includes('__')) {
        const splits = col.split('__')
        col = model.knex.raw(`${splits[1]}("${table}"."${splits[0]}")`)
      } else {
        col = `${table}.${col}`
      }

      sql = sql.orderBy(col, order)
    })
  }

  const fields = getFields(args, model, table)
  if (fields) {
    sql = sql.select(fields)
  }

  if (args.distinct) {
    sql = sql.distinct()
  }

  if (args.distinctOn) {
    sql = sql.distinctOn(args.distinctOn)
  }

  where(sql, args.where, table, model)
  groupBy(sql, args.groupBy, table)
  having(sql, args.having, model.knex, table)

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

function buildModelResultMapping (res, parentChild, modelInstancesMapping) {
  const fieldTableMapping = buildFiledTableMapping(modelInstancesMapping)
  const tableNames = getTableNames(res)
  const tableFieldMapping = swapKeyValue(fieldTableMapping)
  const mapping = {}
  tableNames.forEach(tableName => {
    mapping[tableFieldMapping[tableName]] = {}
  })

  const uniqueColumnMapping = {}
  tableNames.forEach(tableName => {
    const uniqueColumn = modelInstancesMapping[tableFieldMapping[tableName]].uniqueColumn
    uniqueColumnMapping[tableName] = `${tableName}${JOIN_TABLE_SEPARATOR}${uniqueColumn}`
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
      const id = each[uniqueColumnMapping[tableName]]
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
        // sort so that the result is consistent
        ids[parent][child][id].sort()
      }
    }
  }
  return { mapping, ids }
}

function getParentChild (includeField) {
  function dfs (parentChild, key, value) {
    for (const fieldName in value.include) {
      parentChild.add([key, fieldName])
      dfs(parentChild, fieldName, value.include[fieldName])
    }
  }

  const parentChild = new Set()
  dfs(parentChild, Object.keys(includeField)[0], Object.values(includeField)[0])
  return parentChild
}

function sortNestedFields (nestedRes, orderBy) {
  if (_.isEmpty(orderBy)) return nestedRes
  const columns = orderBy.map((each) => each.column)
  const orders = orderBy.map((each) => each.order || 'asc')
  const sorted = _.orderBy(nestedRes, columns, orders)
  return sorted
}

function fillNestedValue (current, nestedRes, modelResultMapping, includeField, modelInstancesMapping) {
  const [child, includeFieldValue] = Object.entries(includeField)[0]
  const currentModel = modelInstancesMapping[current]
  const ids = modelResultMapping.ids
  const objects = modelResultMapping.mapping
  const isOneToOneMapping = _.isString(currentModel.fields[child].type)

  // determine idColumn
  let idColumn = currentModel.uniqueColumn
  // we don't use buildModelResultMapping on the BASE TABLE
  if (current === BASE_TABLE) {
    idColumn = `${current}${JOIN_TABLE_SEPARATOR}${idColumn}`
  }
  nestedRes.forEach(record => {
    record[child] = ids[current][child][record[idColumn]]

    if (!_.isNil(record[child])) {
      record[child] = record[child].map(each => objects[child][each])

      // sort in memory
      record[child] = sortNestedFields(record[child], includeFieldValue.orderBy)

      // limit and offset
      const { limit, offset } = currentModel.getLimitOffset(includeFieldValue)
      record[child] = record[child].slice(offset, limit + offset)

      if (isOneToOneMapping) {
        record[child] = record[child] ? record[child][0] : null
      }

      for (const each in includeFieldValue.include) {
        if (isOneToOneMapping) {
          fillNestedValue(child, [record[child]], modelResultMapping, { [each]: includeFieldValue.include[each] }, modelInstancesMapping)
        } else {
          fillNestedValue(child, record[child], modelResultMapping, { [each]: includeFieldValue.include[each] }, modelInstancesMapping)
        }
      }
    }
  })
}

function buildFiledTableMapping (modelInstancesMapping) {
  const mapping = {}
  for (const name in modelInstancesMapping) {
    mapping[name] = modelInstancesMapping[name].table
  }
  mapping[BASE_TABLE] = BASE_TABLE
  return mapping
}

async function addNestedFields (res, args, model) {
  if (res.length === 0) return res
  for (const each in args.include) {
    await addNestedField(res, model, { [each]: args.include[each] })
  }
}

async function addNestedField (res, model, includeField) {
  if (res.length === 0) return res
  const baseIds = res.map(each => each[model.uniqueColumn])
  const baseTableName = model.baseTable()
  const fieldName = Object.keys(includeField)[0]
  const joinHint = model.fields[fieldName]

  const baseRelationColumnRename = `${BASE_TABLE}${JOIN_TABLE_SEPARATOR}${model.uniqueColumn}`
  let sql = model.knexE().whereIn(`${baseTableName}.${model.uniqueColumn}`, baseIds)
  sql = sql.select(`${baseTableName}.${model.uniqueColumn} as ${baseRelationColumnRename}`)

  join(sql, model.modelInstancesMapping, joinHint, includeField)

  model.debugKenex(sql, 'SEARCH')
  const nestedRes = await sql
  const parentChild = getParentChild(includeField)
  parentChild.add([BASE_TABLE, fieldName])

  const modelResultMapping = buildModelResultMapping(nestedRes, parentChild, model.modelInstancesMapping)
  fillNestedValue(BASE_TABLE, nestedRes, modelResultMapping, includeField, model.modelInstancesMapping)
  mergeNestedValueToBase(res, model.uniqueColumn, fieldName, nestedRes, baseRelationColumnRename)
}

function mergeNestedValueToBase (baseRes, baseUniqueColumn, fieldName, nestedRes, baseRelationColumnRename) {
  const nestedResMapping = {}
  nestedRes.forEach(each => {
    nestedResMapping[each[baseRelationColumnRename]] = each[fieldName]
  })

  baseRes.forEach(each => {
    each[fieldName] = nestedResMapping[each[baseUniqueColumn]]
  })
}

function addJoin (sql, joinMethod, joinHint, onFiledValue, tableName) {
  if (joinHint.through) {
    sql = sql[joinMethod](joinHint.through.from.split('.')[0], function () {
      this.on(joinHint.from, '=', joinHint.through.from)
    })

    sql = sql[joinMethod](tableName, function () {
      this.on(joinHint.to, '=', joinHint.through.to)
      addOn(this, onFiledValue, tableName)
    })
  } else {
    sql = sql[joinMethod](tableName, function () {
      this.on(joinHint.from, '=', joinHint.to)
      addOn(this, onFiledValue, tableName)
    })
  }
}

function join (sql, modelInstancesMapping, joinHint, includeField) {
  console.log(includeField)
  const [includeFieldName, includeFieldValue] = Object.entries(includeField)[0]
  const fieldModel = modelInstancesMapping[includeFieldName]
  const tableName = fieldModel.table
  const joinMethod = includeFieldValue.joinType || 'leftJoin'

  if (!['join', 'innerJoin', 'leftJoin', 'rightJoin', 'fullOuterJoin', 'crossJoin'].includes(joinMethod)) {
    throw new Error(`Invalid join type: ${joinMethod}`)
  }

  addJoin(sql, joinMethod, joinHint, includeFieldValue.on, tableName)

  // select string fields of this layer
  const stringFields = includeFieldValue.select
  // add id filed so that is easy to infer later
  stringFields.push(fieldModel.uniqueColumn)
  stringFields.forEach(colName => {
    sql = sql.select(`${tableName}.${colName} as ${tableName}${JOIN_TABLE_SEPARATOR}${colName}`)
  })

  // join the next layer
  for (const each in includeFieldValue.include) {
    const joinHint = fieldModel.fields[each]
    join(sql, modelInstancesMapping, joinHint, { [each]: includeFieldValue.include[each] })
  }
}

module.exports = { transformRead, addNestedFields }
