const DATA = require('../data.json');

function getAccounts(call, callback) {
  const { customerId } = call.request;
  console.info(new Date(), 'new request', 'getAccounts', { customerId });
  const accounts = DATA.accounts.filter(a => a.customerId === customerId);
  callback(null, { accounts });
}

const rpcHandlers = {
  getAccounts,
};

module.exports = {
  rpcHandlers,
};
