import React from 'react'
import './App.css'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { MetaMaskDialog } from './components/MetaMaskDialog/MetaMaskDialog.component'
import { ExchangePanel } from './components/ExchangePanel/ExchangePanel.component'
import { TokenPanel } from './components/TokenPanel/TokenPanel.component'
import { BaseTokensEnum } from './utils/utils'
import { InputProvider } from './context/inputs'

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  root: {
    height: '100vh',
    borderRadius: 0,
    [breakpoints.down('sm')]: {
      height: '100%'
    }
  },
  header: {
    padding: `${spacing(8)}px 0px`
  }
}))

const App = () => {
  const classes = useStyles()

  return (
    <Paper className = {classes.root}>
      <MetaMaskDialog />
      <Typography align='center' variant='h2' className={classes.header}>Token XChange</Typography>
      <Grid container justify='center' direction="row" alignItems="center" spacing={2}>
        <InputProvider>
          <TokenPanel baseToken={BaseTokensEnum.TokenA}/>
          <ExchangePanel />
          <TokenPanel baseToken={BaseTokensEnum.TokenB}/>
        </InputProvider>
      </Grid>
    </Paper>
  )
}

export default App
