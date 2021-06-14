import React, { useState, useEffect } from 'react'
import { useMetaMask } from 'metamask-react'
import { ethers, Signer } from 'ethers'

import {
  TokenA,
  TokenA__factory,
  TokenB,
  TokenB__factory,
  TokenExchange,
  TokenExchange__factory
} from '../contracts'
import { AsyncState } from '../utils/utils'

export type ExchangeContractsCtx = {
  TA: TokenA,
  TB: TokenB,
  TEx: TokenExchange,
  state: AsyncState,
  status: ReturnType<typeof useMetaMask>['status'],
  account: string | null
}

const TOKEN_A_ADDRESS = '0xAeBa67dF7982b3986939eF328722220a03d0Ea3e'
const TOKEN_B_ADDRESS = '0x3B9f9f2e35E90D2e0152BB070a83905E6c5CaB6D'
const TOKEN_EXCHANGE_ADDRESS = '0x84F4dAc03a272bA25D249bb25B98BC829adBD09E'

export const ContractContext = React.createContext<ExchangeContractsCtx>({
  TA: null as any,
  TB: null as any,
  TEx: null as any,
  state: 'idle',
  status: 'initializing',
  account: null
})

export const ContractProvider: React.FC = ({ children }) => {
  const { ethereum, status, account } = useMetaMask()
  const [TA, setTA] = useState<TokenA>(null as any)
  const [TB, setTB] = useState<TokenB>(null as any)
  const [TEx, setTEx] = useState<TokenExchange>(null as any)
  const [signer, setSigner] = useState<Signer>(null as any)
  const [state, setState] = useState<AsyncState>('idle')

  useEffect(() => {
    try {
      if (status === 'connected' && !signer) {
        setState('loading')
        setSigner((new ethers.providers.Web3Provider(ethereum)).getSigner())
      }
    } catch (e) {
      setState('error')
    }
  }, [ethereum, signer, status])

  useEffect(() => {
    // Typing factory is some kind of misunderstanding, I gave up
    async function getInstance (factory: any, address: any, setter: any) {
      const instance = await setter(factory.connect(address, signer))
      return instance
    }

    async function setInstance () {
      try {
        if (signer) {
          if (!TA) await getInstance(TokenA__factory, TOKEN_A_ADDRESS, setTA)
          if (!TB) await getInstance(TokenB__factory, TOKEN_B_ADDRESS, setTB)
          if (!TEx) await getInstance(TokenExchange__factory, TOKEN_EXCHANGE_ADDRESS, setTEx)
        }

        if (TA && TB && TEx) {
          setState('ready')
        }
      } catch (e) {
        setState('error')
      }
    }

    setInstance()
  }, [TA, TB, TEx, signer])

  return (
    <ContractContext.Provider value={{ TA, TB, TEx, status, state, account }}>
      {children}
    </ContractContext.Provider>
  )
}
