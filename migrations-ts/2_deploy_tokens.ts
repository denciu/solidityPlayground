const TokenA = artifacts.require('TokenA')
const TokenB = artifacts.require('TokenB')

const tokenA = {
  name: 'Token A',
  symbol: 'TA'
}

const tokenB = {
  name: 'Token B',
  symbol: 'TB'
}

module.exports = async function (deployer, network, accounts) {
  console.log('robie deploy tokenikow')
  await deployer.deploy(TokenA, tokenA.name, tokenA.symbol)
  const TokenAInst = await TokenA.deployed()
  console.log(TokenAInst.address)
  await deployer.deploy(TokenB, tokenB.name, tokenB.symbol)
} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { }