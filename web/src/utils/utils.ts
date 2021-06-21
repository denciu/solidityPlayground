import { BigNumber, ContractTransaction } from 'ethers'

export type AsyncState = 'idle' | 'loading' | 'ready' | 'error'

export enum BaseTokensEnum {
  TokenA = 'TA',
  TokenB = 'TB'
}

// Settings
const FE_DECIMALS = 2

const DisplayToWei = (amount: string | number, tokenDecimals = 18, FEDecimals = FE_DECIMALS) => {
  const displayedDecimals = tokenDecimals - FEDecimals
  const tokens = Number(amount) * 10 ** FEDecimals
  const weis = BigNumber.from(tokens).mul(BigNumber.from(10).pow(displayedDecimals))
  return weis
}

const WeiToDisplay = (amount: BigNumber, tokenDecimals = 18, FEDecimals = FE_DECIMALS) => {
  const displayedDecimals = tokenDecimals - FEDecimals
  const cents = BigNumber.from(amount).div(BigNumber.from(10).pow(displayedDecimals)).toNumber()
  const display = (cents / 10 ** FEDecimals).toFixed(2)
  return display
}

export const convert = {
  WeiToDisplay,
  DisplayToWei
}

export const getReceipt = async (tx: Promise<ContractTransaction>): Promise<boolean> => {
  const txDetails = await tx
  const { status } = await txDetails.wait()
  return !!status
}
