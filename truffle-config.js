require('ts-node/register');
require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");

module.exports = {
  // Uncommenting the defaults below 
  // provides for an easier quick-start with Ganache.
  // You can also follow this format for other networks;
  // see <http://truffleframework.com/docs/advanced/configuration>
  // for more details on how to specify configuration options!
  //
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    test: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    robsten: {
      provider: () => new HDWalletProvider(process.env.PRIVATEKEY, "https://ropsten.infura.io/v3/" + process.env.INFURAKEY),
      network_id: 3,       // Ropsten's id
      gas: 5500000,        // Ropsten has a lower block limit than mainnet
      confirmations: 2,    // # of confs to wait between deployments. (default: 0)
      timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      skipDryRun: true     // Skip
    },
  },
  compilers: {
    solc: {
      version: "0.8.3"
    }
  }

};
