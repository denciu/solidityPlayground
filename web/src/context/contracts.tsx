import React, { useState, useEffect, useContext } from 'react'
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
  account: string | null,
  controls: {
    disabled: boolean,
    setDisabled: (val: boolean) => void
  }
}

export const ContractContext = React.createContext<ExchangeContractsCtx>({
  TA: null as any,
  TB: null as any,
  TEx: null as any,
  state: 'idle',
  status: 'initializing',
  account: null,
  controls: {
    disabled: false,
    setDisabled: () => { return null }
  }
})

export const ContractProvider: React.FC = ({ children }) => {
  const { ethereum, status, account } = useMetaMask()
  const [TA, setTA] = useState<TokenA>(null as any)
  const [TB, setTB] = useState<TokenB>(null as any)
  const [TEx, setTEx] = useState<TokenExchange>(null as any)
  const [signer, setSigner] = useState<Signer>(null as any)
  const [state, setState] = useState<AsyncState>('idle')
  const [disabled, setDisabled] = useState(false)

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
      const instance = await factory.connect(address, signer)
      setter(instance)
    }

    async function setInstance () {
      try {
        if (signer) {
          if (!TA) await getInstance(TokenA__factory, process.env.REACT_APP_TOKEN_A_ADDRESS, setTA)
          if (!TB) await getInstance(TokenB__factory, process.env.REACT_APP_TOKEN_B_ADDRESS, setTB)
          if (!TEx) await getInstance(TokenExchange__factory, process.env.REACT_APP_TOKEN_EX_ADDRESS, setTEx)
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

  const controls = {
    disabled,
    setDisabled
  }

  return (
    <ContractContext.Provider value={{ TA, TB, TEx, status, state, account, controls }}>
      {children}
    </ContractContext.Provider>
  )
}

export const useContracts = () => useContext(ContractContext)
