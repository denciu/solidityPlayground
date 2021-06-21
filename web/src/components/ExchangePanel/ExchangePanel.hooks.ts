
import {
  useState,
  useEffect,
  useCallback,
  useMemo
} from 'react'
import { useContracts } from '../../context/contracts'
import { BaseTokensEnum, convert, getReceipt } from '../../utils/utils'

export const useExchangePanel = () => {
  const [exRate, setExRate] = useState(0)
  const [exDecimals, setExDecimals] = useState(0)
  const {
    TEx,
    state,
    controls,
    ...tokens
  } = useContracts()

  const { disabled, setDisabled } = controls

  const getExRate = useCallback(async () => {
    if (!TEx) return
    const exRateVal = await TEx.getPrice()
    setExRate(exRateVal.toNumber())
  }, [TEx])

  const getExDecimals = useCallback(async () => {
    const exDecimalsVal = await TEx.decimals()
    setExDecimals(exDecimalsVal)
  }, [TEx])

  const makeExchange = useCallback(async (amount: number, baseToken: BaseTokensEnum) => {
    if (!TEx || !tokens.TA || !tokens.TB) return
    if (amount < 0.01) return

    try {
      const amountBN = convert.DisplayToWei(amount)
      setDisabled(true)
      await getReceipt(tokens[baseToken].approve(TEx.address, amountBN))
      await getReceipt(TEx.exchange(tokens[baseToken].address, amountBN))
      setDisabled(false)
    } catch (e) {
      setDisabled(false)
    }
  }, [TEx, setDisabled, tokens])

  const getDisplayedExRate = useMemo(() => {
    return (exRate / 10 ** exDecimals).toFixed(2)
  }, [exDecimals, exRate])

  useEffect(() => {
    if (state === 'ready') {
      getExRate()
      getExDecimals()
    }
  }, [state, disabled, getExRate, getExDecimals])

  return {
    disabled,
    exRate: getDisplayedExRate,
    makeExchange
  }
}
