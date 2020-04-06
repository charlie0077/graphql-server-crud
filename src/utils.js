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

function getSelectionFields (selectionSet) {
  const res = {}
  selectionSet.selections.forEach(each => {
    if (each.selectionSet) {
      res[each.name.value] = getSelectionFields(each.selectionSet)
    } else if (!each.name.value.startsWith('__')) {
      res[each.name.value] = each.name.value
    }
  })
  return res
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

module.exports = {
  isEmpty,
  buildInstance,
  asyncForEach,
  getSelectionFields,
  buildModelInstancesMapping
}
