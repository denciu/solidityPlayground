import React, { useState, useContext } from 'react'
import { BaseTokensEnum } from '../utils/utils'

type ClickHandler = (val: number) => Promise<void>
type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => void

type InputControl = {
  value: string,
  setValue: StateAccess<string>['setter'],
  onChange: ChangeHandler
  onClick: (handler: ClickHandler) => () => Promise<void>
}

type InputsCtx = {
  [k in BaseTokensEnum]: InputControl
}

type StateAccess<T> = {
  getter: T,
  setter: (val: T) => void
}

const initialInput: InputControl = {
  value: '0.00',
  setValue: null as any,
  onChange: null as any,
  onClick: null as any
}

export const InputContext = React.createContext<InputsCtx>({
  TA: initialInput,
  TB: initialInput
})

export const InputProvider: React.FC = ({ children }) => {
  const [TAInput, setTAInput] = useState('0.00')
  const [TBInput, setTBInput] = useState('0.00')

  const onChangeSetter = (setter: StateAccess<string>['setter']) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setter(val)
  }

  const onClickSetter = ({ getter, setter }: StateAccess<string>) => (handler: ClickHandler) => async () => {
    await handler(Number(getter))
    setter('0.00')
  }

  const createInput = ({ getter, setter }: StateAccess<string>): InputControl => ({
    value: getter,
    setValue: setter,
    onChange: onChangeSetter(setter),
    onClick: onClickSetter({ getter, setter })
  })

  const TA = createInput({ getter: TAInput, setter: setTAInput })
  const TB = createInput({ getter: TBInput, setter: setTBInput })

  return (
    <InputContext.Provider value={{ TA, TB }}>
      {children}
    </InputContext.Provider>
  )
}

export const useInputs = () => useContext(InputContext)
