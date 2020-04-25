const log = async (resolve, parent, args, context, info) => {
  const result = await resolve(parent, args, context, info)
  return result
}

const myMiddleware = {
  Query: log,
  Mutation: log
}

const middlewares = [myMiddleware]

module.exports = {
  middlewares
}
