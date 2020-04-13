require('dotenv').config()
const { ApolloServer, makeExecutableSchema, gql } = require('apollo-server')
const { applyMiddleware } = require('graphql-middleware')

const typeDef = gql`
  type Query {
    root: String
  }
  type Mutation {
    root: String
  }
`

// userInfo domain
const userInfo = require('./userInfo')
const typeDefs = [typeDef, userInfo.typeDef]
const resolvers = [userInfo.resolvers]

// add default typeDefs and resolvers
// I am using the "src" for my quick local test
const libPath = process.env.NODE_ENV === 'test' ? '../src' : 'graphql-server-crud'
const { addTypeDefs, addResolvers } = require(libPath)
const models = require('./models')
addTypeDefs(typeDefs, models)
addResolvers(resolvers, models)

// define the schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// add middleware; the middleware has nothing to do with graphql-server-crud;
const { middlewares } = require('./middlewares')
const schemaWithMiddleware = applyMiddleware(schema, ...middlewares)

const server = new ApolloServer({ schema: schemaWithMiddleware })

module.exports = server
