const _ = require('lodash')

function isEmpty (obj) {
  return (obj === undefined) || (obj === null) || (Object.keys(obj).length === 0)
}

function buildInstance (Model) {
  if (typeof Model === 'function') {
    return new Model()
  } else {
    return Model
  }
}

async function asyncForEach (array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

function buildModelInstancesMapping (models) {
  if (!_.isArray(models)) {
    models = Object.values(models)
  }

  const modelInstancesMapping = {}
  models.forEach(model => {
    const modelInstance = buildInstance(model)
    const name = modelInstance.constructor.name.toLowerCase()
    if (name in modelInstancesMapping) {
      throw new Error(`Duplicate model detected: ${modelInstance.constructor.name}`)
    }
    modelInstancesMapping[name] = modelInstance
  })

  return modelInstancesMapping
}

function addOrCreate (object, item) {
  object = object || new Set()
  object.add(item)
  return object
}

function swapKeyValue (object) {
  const newObject = {}
  for (const key in object) {
    newObject[object[key]] = key
  }
  return newObject
}

function getFieldsFromInfo (parsedResolveInfo) {
  return Object.values(Object.values(parsedResolveInfo.fieldsByTypeName)[0])
}

function getModelFieldsFromInfo (parsedResolveInfo) {
  const fields = getFieldsFromInfo(parsedResolveInfo)
  return fields.filter(field => !_.isEmpty(field.fieldsByTypeName))
}

function getStringFieldsFromInfo (parsedResolveInfo) {
  const fields = getFieldsFromInfo(parsedResolveInfo)
  return fields.filter(field => _.isEmpty(field.fieldsByTypeName))
}

module.exports = {
  isEmpty,
  buildInstance,
  asyncForEach,
  buildModelInstancesMapping,
  addOrCreate,
  swapKeyValue,
  getModelFieldsFromInfo,
  getStringFieldsFromInfo
}
