import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { MetaMaskProvider } from 'metamask-react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { theme } from './theme/theme'
import { ContractProvider } from './context/contracts'

ReactDOM.render(
  <React.StrictMode>
    <MetaMaskProvider>
    <ContractProvider>
      <MuiThemeProvider theme={theme}>
       <App />
      </MuiThemeProvider>
      </ContractProvider>
    </MetaMaskProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
