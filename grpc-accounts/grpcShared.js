const grpc     = require('@grpc/grpc-js');
const pbLoader = require('@grpc/proto-loader');

const pbFile = __dirname + '/../accounts.proto';

function loadAccountServiceDefn() {
  const pbOptions = {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  };

  const pbDefnText = pbLoader.loadSync(pbFile, pbOptions);
  const pbDefn     = grpc.loadPackageDefinition(pbDefnText);

  return pbDefn.accounts; // namespace
}

module.exports = {
  loadAccountServiceDefn,
};
