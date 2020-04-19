const _ = require('lodash')
const { addOrCreate, swapKeyValue, getStringFieldsFromInfo, getModelFieldsFromInfo, asyncForEach } = require('./utils')
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

function getFields (parsedResolveInfo, model, table) {
  const stringFields = getStringFieldsFromInfo(parsedResolveInfo)
  const fields = stringFields.map(field => field.name)
  // always select unique column, so that we know how to rearrange the result later
  fields.push(model.uniqueColumn)

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

function transformRead (sql, args, limit, offset, context, model) {
  const table = model.baseTable()
  context.modelInstancesMapping[BASE_TABLE] = model
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

  const fields = getFields(args.parsedResolveInfo, model, table)
  if (fields) {
    sql = sql.select(fields)
  }

  if (args.distinct) {
    sql = sql.distinct(args.distinct)
  }

  if (args.distinctOn) {
    sql = sql.distinctOn(args.distinctOn)
  }

  where(sql, args.where, table)
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

function buildModelResultMapping (res, parentChild, context) {
  const fieldTableMapping = buildFiledTableMapping(context)
  const tableNames = getTableNames(res)
  const tableFieldMapping = swapKeyValue(fieldTableMapping)
  const mapping = {}
  tableNames.forEach(tableName => {
    mapping[tableFieldMapping[tableName]] = {}
  })

  const uniqueColumnMapping = {}
  tableNames.forEach(tableName => {
    const uniqueColumn = context.modelInstancesMapping[tableFieldMapping[tableName]].uniqueColumn
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

function getParentChild (parsedResolveInfo) {
  function dfs (parentChild, current, parsedResolveInfo) {
    const modelFields = getModelFieldsFromInfo(parsedResolveInfo)
    modelFields.forEach(field => {
      parentChild.add([current, field.name])
      dfs(parentChild, field.name, field)
    })
  }

  const parentChild = new Set()
  dfs(parentChild, parsedResolveInfo.name, parsedResolveInfo)
  return parentChild
}

function fillNestedValue (current, nestedRes, modelResultMapping, parsedResolveInfo, context) {
  const currentModel = context.modelInstancesMapping[current]
  const ids = modelResultMapping.ids
  const objects = modelResultMapping.mapping
  const child = parsedResolveInfo.name
  const isOneToOneMapping = _.isString(currentModel.fields[child].type)

  // determine idColumn
  let idColumn = currentModel.uniqueColumn
  // we don't use buildModelResultMapping on the BASE TABLE
  if (current === BASE_TABLE) {
    idColumn = `${current}${JOIN_TABLE_SEPARATOR}${idColumn}`
  }

  const childModelFields = getModelFieldsFromInfo(parsedResolveInfo)
  nestedRes.forEach(record => {
    record[child] = ids[current][child][record[idColumn]]

    if (!_.isNil(record[child])) {
      record[child] = record[child].map(each => objects[child][each])
      if (isOneToOneMapping) {
        record[child] = record[child] ? record[child][0] : null
      }
      childModelFields.forEach(each => {
        if (isOneToOneMapping) {
          fillNestedValue(child, [record[child]], modelResultMapping, each, context)
        } else {
          fillNestedValue(child, record[child], modelResultMapping, each, context)
        }
      })
    }
  })
}

function buildFiledTableMapping (context) {
  const mapping = {}
  for (const name in context.modelInstancesMapping) {
    mapping[name] = context.modelInstancesMapping[name].table
  }
  mapping[BASE_TABLE] = BASE_TABLE
  return mapping
}

async function addNestedFields (res, context, model) {
  if (res.length === 0) return res
  const modelFields = getModelFieldsFromInfo(context.parsedResolveInfo)
  await asyncForEach(modelFields, async modelField => {
    await addNestedField(res, context, model, modelField)
  })
}

async function addNestedField (res, context, model, modelField) {
  if (res.length === 0) return res
  const baseIds = res.map(each => each[model.uniqueColumn])
  const baseTableName = model.baseTable()
  const joinHint = model.fields[modelField.name]

  const baseRelationColumnRename = `${BASE_TABLE}${JOIN_TABLE_SEPARATOR}${model.uniqueColumn}`
  let sql = model.knexE().whereIn(`${baseTableName}.${model.uniqueColumn}`, baseIds)
  sql = sql.select(`${baseTableName}.${model.uniqueColumn} as ${baseRelationColumnRename}`)

  join(sql, context, joinHint, modelField)

  model.debugKenex(sql, 'SEARCH')
  const nestedRes = await sql
  const parentChild = getParentChild(modelField)
  parentChild.add([BASE_TABLE, modelField.name])

  const modelResultMapping = buildModelResultMapping(nestedRes, parentChild, context)
  fillNestedValue(BASE_TABLE, nestedRes, modelResultMapping, modelField, context)
  mergeNestedValueToBase(res, model.uniqueColumn, modelField.name, nestedRes, baseRelationColumnRename)
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

function join (sql, context, joinHint, modelField) {
  const modelFieldName = modelField.name
  const fieldModel = context.modelInstancesMapping[modelFieldName]
  const tableName = fieldModel.table
  const joinMethod = modelField.args.joinType || 'leftJoin'

  /* istanbul ignore if  */
  if (!['join', 'innerJoin', 'leftJoin', 'rightJoin', 'fullOuterJoin', 'crossJoin'].includes(joinMethod)) {
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
  stringFields.push({ name: fieldModel.uniqueColumn })
  stringFields.forEach(stringField => {
    const colName = stringField.name
    sql = sql.select(`${tableName}.${colName} as ${tableName}${JOIN_TABLE_SEPARATOR}${colName}`)
  })

  // join the next layer
  const childModelFields = getModelFieldsFromInfo(modelField)
  childModelFields.forEach(each => {
    const joinHint = fieldModel.fields[each.name]
    join(sql, context, joinHint, each)
  })
}

module.exports = { transformRead, addNestedFields }
