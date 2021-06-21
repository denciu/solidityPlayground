import { expectRevert } from '@openzeppelin/test-helpers';
import { toWei as web3ToWei, toBN, Unit } from 'web3-utils'

import {
  TokenExchangeInstance,
  ERC20PresetMinterPauserInstance,
} from "../../types/truffle-contracts"


const ERC20Mintable = artifacts.require("ERC20PresetMinterPauser")
const TokenExchange = artifacts.require("TokenExchange")

const toWei = (val: number, unit: Unit = 'ether') => web3ToWei(web3.utils.toBN(val), unit)

contract("Token Exchange", async accounts => {
  const DEFAULT_PRICE = 200
  const INITIAL_SUPPLY = toWei(1) //10 ** 18
  const INITIAL_ALLOWANCE = toWei(10, 'gwei') // 10 ** 10

  const [owner, user] = accounts

  let tokenA: ERC20PresetMinterPauserInstance
  let tokenB: ERC20PresetMinterPauserInstance
  let tokenExchange: TokenExchangeInstance

  let TADecimals: BN
  let TBDecimals: BN
  let TExDecimals: BN
  let decimalDiff: BN

  const deploy = (initialDeposit: BN = INITIAL_ALLOWANCE) => async () => {
    tokenA = await ERC20Mintable.new('TokenA', 'TA', { from: owner })
    tokenB = await ERC20Mintable.new('TokenB', 'TB', { from: owner })
    tokenExchange = await TokenExchange.new(tokenA.address, tokenB.address, DEFAULT_PRICE, { from: owner })

    TADecimals = await tokenA.decimals()
    TBDecimals = await tokenB.decimals()
    TExDecimals = await tokenExchange.decimals()
    decimalDiff = TBDecimals.sub(TADecimals).add(TExDecimals)

    await tokenA.mint(owner, INITIAL_SUPPLY, { from: owner })
    await tokenB.mint(owner, INITIAL_SUPPLY, { from: owner })

    await tokenA.increaseAllowance(tokenExchange.address, initialDeposit, { from: owner })
    await tokenB.increaseAllowance(tokenExchange.address, initialDeposit, { from: owner })

    await tokenExchange.deposit(tokenA.address, initialDeposit, { from: owner })
    await tokenExchange.deposit(tokenB.address, initialDeposit, { from: owner })

    expect((await tokenA.balanceOf(tokenExchange.address)).toString()).to.equal(initialDeposit.toString())
    expect((await tokenB.balanceOf(tokenExchange.address)).toString()).to.equal(initialDeposit.toString())
  }


  describe('Happy path:', () => {
    before(deploy());

    it('exchange', async () => {
      const USERS_TA_BALANCE = toWei(5, 'gwei')

      await tokenA.transfer(user, USERS_TA_BALANCE, { from: owner })
      expect((await tokenA.balanceOf(user)).toString()).to.equal(USERS_TA_BALANCE.toString(), 'b')

      await tokenA.increaseAllowance(tokenExchange.address, USERS_TA_BALANCE, { from: user })
      expect((await tokenA.allowance(user, tokenExchange.address)).toString()).to.equal(USERS_TA_BALANCE.toString())

      const TAAmount = toWei(5, 'mwei')

      const expectedTBAmount = TAAmount.mul(toBN(10).pow(decimalDiff)).div(toWei(DEFAULT_PRICE, 'wei'))

      await tokenExchange.exchange(tokenA.address, TAAmount, { from: user })
      expect((await tokenB.balanceOf(user)).toString()).to.equal(expectedTBAmount.toString())
    })

    it('change price', async () => {
      const newPrice = toWei(1, 'wei')
      const TBAmount = toWei(1, 'mwei')
      const expectedTAAmount = TBAmount.mul(newPrice).div(toBN(10).pow(decimalDiff))

      const userTABalance = await tokenA.balanceOf(user)
      const expectedNewBalance = userTABalance.add(expectedTAAmount)

      await tokenB.increaseAllowance(tokenExchange.address, TBAmount, { from: user })
      await tokenExchange.updatePrice(newPrice, { from: owner })
      await tokenExchange.exchange(tokenB.address, TBAmount, { from: user })
      expect((await tokenA.balanceOf(user)).toString()).to.equal(expectedNewBalance.toString())
    })

    it('allows owner to withdraw', async () => {
      const contractBalance = await tokenA.balanceOf(tokenExchange.address)
      const ownersBalance = await tokenA.balanceOf(owner)

      await tokenExchange.withdraw(tokenA.address, toWei(5, 'gwei'))
      expect((await tokenA.balanceOf(tokenExchange.address)).toString()).to.equal(contractBalance.sub(toWei(5, 'gwei')).toString())
      expect((await tokenA.balanceOf(owner)).toString()).to.equal(ownersBalance.add(toWei(5, 'gwei')).toString())
    })
  })

  describe('Error handling:', () => {
    beforeEach(deploy(toBN(0)));

    it('TEx has not enough balance for exchange', async () => {
      await tokenA.transfer(user, 1000, { from: owner })
      await tokenA.increaseAllowance(tokenExchange.address, 1000, { from: user })
      await expectRevert(tokenExchange.exchange(tokenA.address, 1000, { from: user }), "ERC20: transfer amount exceeds balance.")
    })

    it('TEx has no allowance set by user', async () => {
      await tokenA.transfer(user, 1000, { from: owner })

      const currentTExAllowance = await tokenA.allowance(user, tokenExchange.address)
      await tokenA.decreaseAllowance(tokenExchange.address, currentTExAllowance, { from: user })
      await expectRevert(tokenExchange.exchange(tokenA.address, 1000, { from: user }), "ERC20: transfer amount exceeds allowance.")
    })

    it('deposit to wrong address', async () => {
      await expectRevert(tokenExchange.deposit(user, 1000, { from: owner }), "TokenExchange: Token address not recognized.")
    })
  })

})