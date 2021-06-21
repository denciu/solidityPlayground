
import {
  useState,
  useEffect,
  useCallback
} from 'react'
import { BaseTokensEnum, convert, getReceipt } from '../../utils/utils'
import { useContracts } from '../../context/contracts'

export const useTokenDetails = (baseToken: BaseTokensEnum) => {
  const [name, setName] = useState('')
  const [symbol, setSymbol] = useState('')
  const [isOwner, setIsOwner] = useState(false)
  const [TExBalance, setTExBalance] = useState('0.00')
  const [usersBalance, setUsersBalance] = useState('0.00')

  const {
    TEx,
    account,
    state,
    controls,
    ...tokens
  } = useContracts()

  const { setDisabled, disabled } = controls
  const selectedToken = tokens[baseToken]

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
    const balance = await selectedToken.balanceOf(account)
    setUsersBalance(convert.WeiToDisplay(balance))
  }, [account, selectedToken])

  const getTExBalance = useCallback(async () => {
    if (!TEx) return
    const TExBal = await selectedToken.balanceOf(TEx.address)
    setTExBalance(convert.WeiToDisplay(TExBal))
  }, [TEx, selectedToken])

  const getFaucet = useCallback(async () => {
    setDisabled(true)
    await getReceipt(selectedToken.faucet())
    setDisabled(false)
  }, [selectedToken, setDisabled])

  const deposit = useCallback(async (amount: number) => {
    if (amount < 0.01) return

    setDisabled(true)

    try {
      const amountBN = convert.DisplayToWei(amount)
      await getReceipt(selectedToken.approve(TEx.address, amountBN))
      await getReceipt(TEx.deposit(selectedToken.address, amountBN))
      setDisabled(false)
    } catch (e) {
      setDisabled(false)
    }
  }, [TEx, selectedToken, setDisabled])

  const withdraw = useCallback(async (amount: number) => {
    if (amount < 0.01) return

    setDisabled(true)

    try {
      const amountBN = convert.DisplayToWei(amount)
      await getReceipt(TEx.withdraw(selectedToken.address, amountBN))
      setDisabled(false)
    } catch (e) {
      setDisabled(false)
    }
  }, [TEx, selectedToken, setDisabled])

  useEffect(() => {
    if (state === 'ready') {
      getNameAndSymbol()
      getUsersBalance()
      getTExBalance()
      checkOwner()
    }
  }, [
    state,
    disabled,
    checkOwner,
    getTExBalance,
    getUsersBalance,
    getNameAndSymbol
  ])

  return {
    name,
    symbol,
    isOwner,
    TExBalance,
    usersBalance,
    deposit,
    withdraw,
    disabled,
    getFaucet
  }
}
