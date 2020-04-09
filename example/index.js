// server in a different file so that it is easy to reuse in loca, lambda, test, etc.
const server = require('./server')

const port = process.env.PORT || '4000'

server.listen({ port }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url} `)
  process.env.URL = url
})
