const { gql } = require('apollo-server')

const commonTypes = gql`
  input StringFilter {
    gt: String
    gte: String
    lt: String
    lte: String
    eq: String
    ne: String
    in: [String!]
    nin: [String!]
    between: [String!]
    nbetween: [String!]
    null: Boolean
  }

  input FloatFilter {
    gt: Float
    gte: Float
    lt: Float
    lte: Float
    eq: Float
    ne: Float
    in: [Float!]
    nin: [Float!]
    between: [Float!]
    nbetween: [Float!]
    null: Boolean
  }

  input IntFilter {
    gt: Int
    gte: Int
    lt: Int
    lte: Int
    eq: Int
    ne: Int
    in: [Int!]
    nin: [Int!]
    between: [Int!]
    nbetween: [Int!]
    null: Boolean
  }

  input BooleanFilter {
    eq: Boolean
    ne: Boolean
    null: Boolean
  }

  input OrderBy {
    column: String!
    order: String
  }
`

module.exports = commonTypes
