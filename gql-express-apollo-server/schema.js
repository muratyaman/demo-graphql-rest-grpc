const { gql }          = require('apollo-server-express');
const axios            = require('axios');
const { readFileSync } = require('fs');
const { resolve }      = require('path');

const HOST_CUSTOMERS = 'http://127.0.0.1:9002';
const customerClient = axios.create({ baseURL: HOST_CUSTOMERS });

const gqlFile    = resolve(__dirname, '..', 'schema.gql');
const schemaText = readFileSync(gqlFile);

const typeDefs = gql`${schemaText}`;

async function getCustomer(id) {
  const res = await customerClient.get('/customers/' + id);
  const { data: customer, error } = res.data;
  // TODO use error
  return customer;
}

async function getAccounts(customerId) {
  const res = await customerClient.get(`/customers/${customerId}/accounts`);
  const { data: accounts, error } = res.data;
  // TODO use error
  return accounts;
}

const resolvers = {
  Query: {
    customer: async (parent, args, ctx, info) => getCustomer(args.id),
  },
  Customer: {
    id: parent => parent.id,
    names: parent => parent.names,
    accounts: async (parent, args, ctx, info) => getAccounts(parent.id),
  },
  Account: {
    id: parent => parent.id,
    sortCode: parent => parent.sortCode,
    accountNumber: parent => parent.accountNumber,
    balance: parent => parent.balance,
    currency: parent => parent.currency,
    customer: async (parent, args, ctx, info) => getCustomer(parent.customerId),
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
