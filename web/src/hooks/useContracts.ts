import { useContext } from 'react'
import { ContractContext } from '../context/contracts'

export const useContracts = () => useContext(ContractContext)
