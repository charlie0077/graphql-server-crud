import ApolloClient from 'apollo-boost'
import 'cross-fetch/polyfill'
require('dotenv').config()

export const client = new ApolloClient({
  uri: `http://localhost:${process.env.PORT}/`,
  onError: (e) => { console.log(e) }
})
