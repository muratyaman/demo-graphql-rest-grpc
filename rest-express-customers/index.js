const express  = require('express');
const grpc     = require('@grpc/grpc-js');

const { loadAccountServiceDefn } = require('./grpcShared');

const port = 9002;

const DATA = require('../DATA.json');

const pbAccounts = loadAccountServiceDefn();

const HOST_ACCOUNTS   = '127.0.0.1:9003';
const grpcCredentials = grpc.ChannelCredentials.createInsecure(); // ChannelCredentials ***

const pbAccountsClient = new pbAccounts.AccountService(HOST_ACCOUNTS, grpcCredentials);

main();

async function main() {
  const httpServer = express();

  httpServer.use(logRequest);

  httpServer.get('/customers/:id/accounts', getAccounts);
  httpServer.get('/customers/:id',          getCustomers);

  httpServer.get('/health', healthCheck);
  httpServer.get('/',       healthCheck);

  // start HTTP server
  await new Promise(resolve => httpServer.listen({ port }, resolve));
  console.log(`🚀 Customer REST service ready at http://127.0.0.1:${port}`);

  return { httpServer }; // can be used for testing
}

function getCustomers(req, res) {
  const { id } = req.params;
  const data = DATA.customers.find(c => c.id === id);
  const error = data ? null : 'not found';
  res.json({ data, error }); // TODO set status code
}

function getAccounts(req, res) {
  const { id } = req.params;
  const gotGrpcResponse = (grpcError, grpcResponse) => {
    console.info(new Date(), 'gotGrpcResponse', grpcError, grpcResponse);
    const { accounts: data } = grpcResponse;
    res.json({ data, error: grpcError }); // TODO set status code
  };
  pbAccountsClient.getAccounts({ customerId: id }, gotGrpcResponse);
}

function logRequest(req, res, next) {
  console.info(new Date(), 'new request', req.path);
  next();
}

function healthCheck(req, res) {
  res.json({ ts: new Date(), info: 'Customers REST server'});
}
