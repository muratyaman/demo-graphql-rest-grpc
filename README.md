# demo-graphql-rest-grpc
sample code for GraphQL, REST and gRPC

Use https://sequencediagram.org/ to view sequence

```
title Sample multi-tier API Architecture
App->GraphQL: send GraphQL command
GraphQL-->REST Customers: get customer details
GraphQL-->REST Customers: get accounts of customer
REST Customers-->DB1: get customer details
REST Customers<--DB1: customer details
REST Customers-->gRPC Accounts: getAccounts()
gRPC Accounts-->DB2: get accounts of customer
gRPC Accounts<--DB2: accounts of customer
REST Customers<--gRPC Accounts: accounts
GraphQL<--REST Customers: customer details
GraphQL<--REST Customers: accounts of customer
App<-GraphQL: send only data pieces asked
```

`DATA.json` is acting like components: DB1 and DB2

# gql-express-apollo-server

There are many options to implement GraphQL services. Here we chose:

* standard Apollo Server (not Federation) with Express

```sh
npm install
npm run start
# 🚀 GraphQL service ready at http://127.0.0.1:9001/graphql
# example command: query { customer(id: "1") { id names } }
# open URL to use web app and see schema etc.
```

Sample `schema.gql`:

```graphql
# @see https://spec.graphql.org/June2018/

type Query {
  customer(id: ID!): Customer!
}

type Customer {
  id: ID!
  names: [String!]!
  accounts: [Account!]!
}

type Account {
  id: ID!
  customer: Customer!
  sortCode: String!
  accountNumber: String!
  balance: String!
  currency: CurrencyEnum!
}

enum CurrencyEnum {
  EUR
  GBP
  USD
}

```

# rest-express-customers

We are using Express to implement a basic RESTful microservice.

```sh
npm install
npm run start
# 🚀 Customer REST service ready at http://127.0.0.1:9002
# example: GET http://127.0.0.1:9002/customers/1
# example: GET http://127.0.0.1:9002/customers/1/accounts
```

# grpc-accounts

We are using Google's libraries for Node:

* @grpc/grpc-js
* @grpc/proto-loader
* google-protobuf

```sh
npm install
npm run start
# 🚀  Accounts gRPC service ready at 127.0.0.1:9003
```

Sample `accounts.proto`

```proto
// @see https://developers.google.com/protocol-buffers/docs/proto3

syntax = "proto3";

package accounts;

service AccountService {
  rpc getAccounts (GetAccountsRequest) returns (GetAccountsResponse) {}
}

message GetAccountsRequest {
  string customerId = 1;
}

message GetAccountsResponse {
  repeated Account accounts = 1;
}

message Account {
  string id = 1;
  string customerId = 2;
  string sortCode = 3;
  string accountNumber = 4;
  string balance = 5;
  string currency = 6;
}
```
