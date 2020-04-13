const { gql } = require('apollo-server')
const commonTypes = require('./commonTypes')
const { isEmpty, buildModelInstancesMapping } = require('./utils')
const _ = require('lodash')

function addTypeDefs (typeDefs, models) {
  const modelInstancesMapping = buildModelInstancesMapping(models)
  const modelInstances = Object.values(modelInstancesMapping)
  const modelNameSet = new Set(modelInstances.map(instance => instance.constructor.name))
  const typesGenerated = modelInstances.map(model => buildTypes(model, modelNameSet)).filter(x => !isEmpty(x))
  const queryGenerated = modelInstances.map(model => buildQuery(model)).filter(x => !isEmpty(x))
  const mutationGenerated = modelInstances.map(model => buildMutation(model)).filter(x => !isEmpty(x))
  typeDefs.push(commonTypes, ...typesGenerated, ...queryGenerated, ...mutationGenerated)
  return typeDefs
}

function buildTypes (model, modelNameSet) {
  let type = ''
  let modelFieldType = ''
  let aggPartial = ''
  let filter = ''
  let havingFilter = ''
  const modelName = model.constructor.name

  const metrics = ['min', 'max', 'sum', 'avg']
  for (const property in model.fields) {
    let fieldType = model.fields[property]
    if ((fieldType === 'Float') || (fieldType === 'Int')) {
      metrics.forEach(metric => {
        aggPartial += `${property}__${metric}: Float\n`
        havingFilter += `${property}__${metric}: FloatFilter\n`
      })
    }

    if (['Int', 'Float', 'Boolean', 'ID', 'String'].includes(fieldType)) {
      aggPartial += `${property}__count: Int\n`
      aggPartial += `${property}__count_distinct: Int\n`
      havingFilter += `${property}__count: IntFilter\n`
      havingFilter += `${property}__count_distinct: IntFilter\n`

      type += `${property}: ${fieldType}\n`
      filter += `${property}: ${fieldType}Filter\n`
    } else {
      if (_.isObjectLike(fieldType)) {
        fieldType = fieldType.type
      }

      if (modelNameSet.has(fieldType)) {
        modelFieldType += `${property}(on: ${fieldType}Filter, joinType: String): [${fieldType}]\n`
      } else {
        throw new Error(`Invalid model type "${fieldType}" detected in model "${modelName}"`)
      }
    }
  }

  filter += `_or: [${modelName}Filter]\n`
  filter += `_and: [${modelName}Filter]\n`

  const raw = `
    type ${modelName} {
      ${type}
      ${modelFieldType}
    }

    type ${modelName}WithAggregation {
      ${type}
      ${modelFieldType}
      ${aggPartial}
    }


    input ${modelName}Input {
      ${type}
    }

    input ${modelName}Filter {
      ${filter}
    }

    input ${modelName}HavingFilter {
      ${filter}
      ${havingFilter}
    }
  `
  return gql`${raw}`
}

function buildQuery (model) {
  const modelName = model.constructor.name
  let partial = ''

  if (model.queryToGenerate.includes('QUERY')) {
    partial += `query${modelName}(
      where: ${modelName}Filter,
      distinct: Boolean, 
      groupBy: [String], 
      having: ${modelName}HavingFilter, 
      limit: Int, offset: Int, 
      orderBy: [OrderBy]): [${modelName}WithAggregation],\n`
  }

  if (model.queryToGenerate.includes('GET')) {
    partial += `get${modelName}(id: ${model.fields.id}!): ${modelName},\n`
  }

  if (model.queryToGenerate.includes('FETCH')) {
    partial += `fetch${modelName}(data: ${modelName}Input): ${modelName},\n`
  }

  if (model.queryToGenerate.includes('BULK_FETCH')) {
    partial += `bulkFetch${modelName}(data: [${modelName}Input!]): [${modelName}],\n`
  }

  if (partial === '') {
    return null
  }

  return gql`
      extend type Query {
        ${partial}
      }
    `
}

function buildMutation (model) {
  const modelName = model.constructor.name
  let partial = ''

  if (model.queryToGenerate.includes('INSERT')) {
    partial += `insert${modelName}(data: ${modelName}Input!): ${modelName},\n`
  }

  if (model.queryToGenerate.includes('UPDATE')) {
    partial += `update${modelName}(data: ${modelName}Input!): ${modelName},\n`
  }

  if (model.queryToGenerate.includes('DELETE')) {
    partial += `delete${modelName}(data: ${modelName}Input!): ${modelName},\n`
  }

  if (model.queryToGenerate.includes('BULK_INSERT')) {
    partial += `bulkInsert${modelName}(data: [${modelName}Input!]): [${modelName}],\n`
  }

  if (model.queryToGenerate.includes('BULK_UPDATE')) {
    partial += `bulkUpdate${modelName}(data: [${modelName}Input!]): [${modelName}],\n`
  }

  if (model.queryToGenerate.includes('BULK_DELETE')) {
    partial += `bulkDelete${modelName}(data: [${modelName}Input!]): [${modelName}],\n`
  }

  if (partial === '') {
    return null
  }

  return gql`
    extend type Mutation {
      ${partial}
    }
  `
}

module.exports = {
  addTypeDefs
}
