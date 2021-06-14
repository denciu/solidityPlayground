const ExchangeHelper = artifacts.require('ExchangeHelper')
const TokenExchange = artifacts.require('TokenExchange')
const TokenA = artifacts.require('TokenA')
const TokenB = artifacts.require('TokenB')

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(ExchangeHelper)
  await deployer.deploy(TokenExchange, TokenA.address, TokenB.address, 2)
  await deployer.link(ExchangeHelper, TokenExchange)

  console.log(`========
  Owner: ${accounts[0]},
  TokenA: ${TokenA.address},
  TokenB: ${TokenB.address},
  TokenEx: ${TokenExchange.address}
  ========
  `)
} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { }