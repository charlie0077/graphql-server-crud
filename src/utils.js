const _ = require('lodash')

function buildInstance (Model) {
  return typeof Model === 'function' ? new Model() : Model
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
    /* istanbul ignore if  */
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

module.exports = {
  buildInstance,
  asyncForEach,
  buildModelInstancesMapping,
  addOrCreate,
  swapKeyValue
}
