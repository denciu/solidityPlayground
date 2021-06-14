
import { BigNumber } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import { BaseTokensEnum } from '../utils/utils'
import { useContracts } from './useContracts'

export const useTokenDetails = (baseToken: BaseTokensEnum) => {
  const { TEx, account, state, ...tokens } = useContracts()
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  // const [precision, setPrecision] = useState(null as any)
  const [TExBalance, setTExBalance] = useState(null as any)
  const [usersBalance, setUsersBalance] = useState(null as any)
  const [isOwner, setIsOwner] = useState(false)
  const [disabled, setDisabled] = useState(false)

  const selectedToken = tokens[baseToken]

  // const getPrecision = useCallback(async () => {
  //   const precisionN = (await selectedToken.decimals())
  //   setPrecision(precisionN)
  // }, [selectedToken])

  const getNameAndSymbol = useCallback(async () => {
    const tokenName = await selectedToken.name()
    const tokenSymbol = await selectedToken.symbol()

    setName(tokenName)
    setSymbol(tokenSymbol)
  }, [selectedToken])

  const checkOwner = useCallback(async () => {
    const ownerAddr = await TEx.owner()

    if (account && !isOwner && ownerAddr.toLowerCase() === account.toLowerCase()) {
      setIsOwner(true)
    }
  }, [TEx, account, isOwner])

  const getUsersBalance = useCallback(async () => {
    if (!account) return
    const balance = Number((await selectedToken.balanceOf(account)).toString())
    setUsersBalance(balance)
  }, [account, selectedToken])

  const getTExBalance = useCallback(async () => {
    if (!TEx) return
    const maxEx = Number((await selectedToken.balanceOf(TEx.address)).toString())
    setTExBalance(maxEx)
  }, [TEx, selectedToken])

  const deposit = async (amount: string) => {
    const amountN = Number(amount)
    if (!amountN) return
    setDisabled(true)

    try {
      const amountBN = BigNumber.from(Number(amount))
      const approval = await selectedToken.approve(TEx.address, amountBN)
      const { status } = await approval.wait()

      if (status) {
        const res = await TEx.deposit(selectedToken.address, amountBN)
        const { status: depositStatus } = await res.wait()

        if (depositStatus) {
          setDisabled(false)
        }
      }
    } catch (e) {
      setDisabled(false)
    }
  }

  const withdraw = async (amount: string) => {
    const amountN = Number(amount)
    if (!amountN) return
    setDisabled(true)

    try {
      const amountBN = BigNumber.from(amountN)
      const res = await TEx.withdraw(selectedToken.address, amountBN)
      const { status } = await res.wait()

      if (status) {
        setDisabled(false)
      }
    } catch (e) {
      setDisabled(false)
    }
  }

  useEffect(() => {
    if (state === 'ready') {
      getNameAndSymbol()
      getUsersBalance()
      getTExBalance()
      checkOwner()
    }
  }, [checkOwner, getNameAndSymbol, getTExBalance, getUsersBalance, state, disabled])

  return {
    isOwner,
    name,
    symbol,
    usersBalance,
    TExBalance,
    deposit,
    withdraw,
    disabled
  }
}
