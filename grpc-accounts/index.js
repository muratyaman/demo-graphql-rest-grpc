const grpc = require('@grpc/grpc-js');
const { loadAccountServiceDefn } = require('./grpcShared'); // TODO use generated static code
const { rpcHandlers } = require('./service');

const ip   = '127.0.0.1';
const port = 9003;
const addr = `${ip}:${port}`;

const grpcCredentials = grpc.ServerCredentials.createInsecure(); // ServerCredentials ***

main();

function main() {
  const grpcServer = new grpc.Server();

  const pbAccounts = loadAccountServiceDefn();
  grpcServer.addService(pbAccounts.AccountService.service, rpcHandlers);

  const onReady = () => {
    grpcServer.start();
  };

  grpcServer.bindAsync(addr, grpcCredentials, onReady);
  console.log(`🚀  Accounts gRPC service ready at ${addr}`);

  return { grpcServer }; // can be used for testing
}
