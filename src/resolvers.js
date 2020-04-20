const { buildModelInstancesMapping } = require('./utils')
const camelCase = require('camelcase')
const { CONTEXT_KEY } = require('./constants')
const { parseResolveInfo } = require('graphql-parse-resolve-info')
const { transformResolverInfo } = require('./resolverInfoTransform')
const _ = require('lodash')

function addResolvers (resolvers, models) {
  const modelInstancesMapping = buildModelInstancesMapping(models)
  Object.values(modelInstancesMapping).forEach(model => {
    model.modelInstancesMapping = modelInstancesMapping
  })
  const resolversGenerated = Object.values(modelInstancesMapping).map(
    model => buildResolver(model)
  ).filter(x => !_.isEmpty(x))
  resolvers.push(...resolversGenerated)
  return resolvers
}

function buildResolver (model) {
  const query = {}
  model.queryToGenerate.forEach(method => {
    if (['GET', 'QUERY', 'FETCH', 'BULK_FETCH'].includes(method)) {
      addMethod(query, model, method)
    }
  })

  const mutation = {}
  model.queryToGenerate.forEach(method => {
    if (['INSERT', 'DELETE', 'UPDATE', 'BULK_INSERT', 'BULK_UPDATE', 'BULK_DELETE'].includes(method)) {
      addMethod(mutation, model, method)
    }
  })

  const res = {
    Query: query,
    Mutation: mutation
  }

  if (_.isEmpty(res.Query)) {
    delete res.Query
  }

  if (_.isEmpty(res.Mutation)) {
    delete res.Mutation
  }
  return res
}

function addMethod (selection, model, method) {
  const modelName = model.constructor.name
  if (model.queryToGenerate.includes(method)) {
    selection[`${camelCase(method)}${modelName}`] = async (obj, args, context, info) => {
      args = transformResolverInfo(parseResolveInfo(info))
      context[CONTEXT_KEY] = {
        actionName: method
      }
      await model.before(args, context, info)
      const res = await model[camelCase(method)](args, context, info)
      await model.after(args, context, info)
      return res
    }
  }
}

module.exports = {
  addResolvers
}
