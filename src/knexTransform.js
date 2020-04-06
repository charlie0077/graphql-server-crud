const _ = require('lodash')

const OR_SYMBOL = '_or'
const AND_SYMBOL = '_and'

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

function addWhere (selection, query, relation) {
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
      selection = selection[method](col, exprEntry[1])
    } else {
      const method = andRelation ? 'where' : 'orWhere'
      selection = selection[method](col, operatorMap(exprEntry[0]), exprEntry[1])
    }
  })

  // process AND
  if (Object.keys(query).includes(AND_SYMBOL)) {
    const subQueries = query[AND_SYMBOL]
    subQueries.forEach(function (each) {
      selection = selection.where(function () {
        addWhere(this, each, AND_SYMBOL)
      })
    })
  }

  // process OR
  if (Object.keys(query).includes(OR_SYMBOL)) {
    const subQueries = query[OR_SYMBOL]
    subQueries.forEach(function (each) {
      selection = selection.orWhere(function () {
        // default to AND
        addWhere(this, each, AND_SYMBOL)
      })
    })
  }
}

function where (selection, query) {
  // default to AND
  addWhere(selection, query, AND_SYMBOL)
}

function groupBy (selection, query) {
  if (_.isNil(query)) {
    return
  }

  query.forEach(entry => {
    selection = selection.groupBy(entry)
  })
}

function having (selection, query, knex) {
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
      col = knex.raw(`${splits[1]}(${splits[0]})`)
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

function getSelectedFieldsString (args) {
  const fields = []
  for (const each in args.selectedFields) {
    if ((typeof args.selectedFields[each]) === 'string') {
      fields.push(each)
    } else {
      fields.push(each.toLowerCase() + '_id')
    }
  }
  return fields
}

function getFields (args, knex) {
  const fields = getSelectedFieldsString(args)
  if (_.isNil(fields)) {
    return []
  }

  const res = fields.map(field => {
    if (field.includes('__')) {
      const splits = field.split('__')
      if (field.includes('__count_distinct')) {
        return knex.raw(`count(distinct ${splits[0]}) as ${field}`)
      } else {
        return knex.raw(`${splits[1]}(${splits[0]}) as ${field}`)
      }
    } else {
      return field
    }
  })

  return res
}

function transformRead (sql, args, limit, offset, knex) {
  sql = sql.limit(limit)
  sql = sql.offset(offset)

  // add order by
  if (args.orderBy) {
    args.orderBy.forEach(each => {
      if (each.order) {
        sql = sql.orderBy(each.column, each.order)
      } else {
        sql = sql.orderBy(each.column, each.order)
      }
    })
  }

  where(sql, args.where)
  groupBy(sql, args.groupBy)
  having(sql, args.having, knex)

  const fields = getFields(args, knex)
  if (fields) {
    sql = sql.select(fields)
  }

  if (args.distinct) {
    sql = sql.distinct()
  }

  return sql
}

module.exports = { transformRead }
