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
// const { addTypeDefs, addResolvers } = require('graphql-server-crud')
// I am using the src for my quick local test, you may want to switch to use the line above
const { addTypeDefs, addResolvers } = require('../src')
const models = require('./models')
addTypeDefs(typeDefs, models)
addResolvers(resolvers, models)

// define the schema
const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// add middleware
const { middlewares } = require('./middlewares')
const schemaWithMiddleware = applyMiddleware(schema, ...middlewares)

const server = new ApolloServer({ schema: schemaWithMiddleware })

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url} `)
})
