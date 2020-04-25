const _ = require('lodash')

function transformResolverInfo (parsedResolveInfo) {
  let transformed = {}
  // args
  transformed = Object.assign(transformed, parsedResolveInfo.args)

  // select fields
  const fields = Object.values(Object.values(parsedResolveInfo.fieldsByTypeName)[0])
  const stringFields = fields.filter(field => _.isEmpty(field.fieldsByTypeName))
  transformed.select = stringFields.map(field => field.name)

  // nested fields
  const nestedFields = fields.filter(field => !_.isEmpty(field.fieldsByTypeName))
  if (nestedFields.length > 0) {
    transformed.include = {}
    nestedFields.forEach(each => {
      transformed.include[each.name] = transformResolverInfo(each)
    })
  }

  return transformed
}

module.exports = { transformResolverInfo }
