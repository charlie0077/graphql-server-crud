const { gql } = require('apollo-server')

const commonTypes = gql`
  input StringFilter {
    gt: String
    gte: String
    lt: String
    lte: [String!]
    eq: String
    ne: String
    in: [String!]
    nin: [String!]
    between: [String!]
    nbetween: [String!]
    exist: Boolean
    nexist: Boolean
  }

  input FloatFilter {
    gt: Float
    gte: Float
    lt: Float
    lte: [Float!]
    eq: Float
    ne: Float
    in: [Float!]
    nin: [Float!]
    between: [Float!]
    nbetween: [Float!]
    exist: Boolean
    nexist: Boolean
  }

  input IntFilter {
    gt: Int
    gte: Int
    lt: Int
    lte: [Int!]
    eq: Int
    ne: Int
    in: [Int!]
    nin: [Int!]
    between: [Int!]
    nbetween: [Int!]
    exist: Boolean
    nexist: Boolean
  }

  input BooleanFilter {
    is: Boolean
    nis: Boolean
    exist: Boolean
    nexist: Boolean
  }

  input OrderBy {
    column: String!
    order: String
  }
`

module.exports = commonTypes
