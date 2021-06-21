import { promises as fs } from 'fs'

const ExchangeHelper = artifacts.require('ExchangeHelper')
const TokenExchange = artifacts.require('TokenExchange')
const TokenA = artifacts.require('TokenA')
const TokenB = artifacts.require('TokenB')

const webEnvFile = 'web/.env'

const replaceVal = (src: string, key: string, newVal: string) => {
  const pattern = `(?<=${key} = ).*`;
  return src.replace(new RegExp(pattern, 'g'), newVal)
}

const updateEnv = async (addresses: Record<'TOKEN_A' | 'TOKEN_B' | 'TOKEN_EX', string>) => {
  const env = await fs.readFile(webEnvFile)
  let parsedEnv = env.toString()

  Object.keys(addresses).forEach(key => {
    parsedEnv = replaceVal(parsedEnv, `${key}_ADDRESS`, addresses[key])
  })

  await fs.writeFile(webEnvFile, parsedEnv)
}

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(ExchangeHelper)
  await deployer.deploy(TokenExchange, TokenA.address, TokenB.address, 300000)
  await deployer.link(ExchangeHelper, TokenExchange)

  console.log(`
  ========
  Owner: ${accounts[0]},
  TokenA: ${TokenA.address},
  TokenB: ${TokenB.address},
  TokenEx: ${TokenExchange.address}
  ========
  `)
  await updateEnv({ TOKEN_A: TokenA.address, TOKEN_B: TokenB.address, TOKEN_EX: TokenExchange.address })
} as Truffle.Migration

// because of https://stackoverflow.com/questions/40900791/cannot-redeclare-block-scoped-variable-in-unrelated-files
export { }