const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema');

const port = 9001;

main();

async function main() {
  const httpServer = express();
  const gqlServer  = new ApolloServer({ typeDefs, resolvers });

  // start GraphQL server
  await gqlServer.start();

  gqlServer.applyMiddleware({ app: httpServer, graphqlPath: '/graphql' });

  httpServer.use(logRequest);

  httpServer.get('/health', healthCheck);
  httpServer.get('/',       healthCheck);

  // start HTTP server
  await new Promise(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 GraphQL service ready at http://127.0.0.1:${port}${gqlServer.graphqlPath}`);

  return { httpServer, gqlServer }; // can be used for testing
}

function logRequest(req, res, next) {
  console.info(new Date(), 'new request', req.path, req.query, req.body);
  next();
}

function healthCheck(req, res) {
  res.json({
    ts: new Date(),
    info: 'GraphQL server',
  });
}
