const { gql } = require('apollo-server')
const { UserInfo } = require('./UserInfo.js')

const typeDef = gql`
  type UserInfo {
    ip: String
    time: String
    id: String
    permission: Boolean
  }

  extend type Query {
    getUserInfo(id: String!): UserInfo
  }
`

const resolvers = {
  Query: {
    getUserInfo: (parent, args) => UserInfo.get(args)
  },

  UserInfo: {
    ip: (parent) => UserInfo.getIp(parent),
    time: UserInfo.getTime
  }
}

module.exports = {
  typeDef,
  resolvers
}
