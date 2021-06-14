import React from 'react'
import './App.css'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import { MetaMaskDialog } from './components/MetaMaskDialog.component'
import { ExchangePanel } from './components/ExchangePanel'
import { TokenPanel } from './components/TokenPanel'
import { BaseTokensEnum } from './utils/utils'

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    height: '100vh',
    borderRadius: 0
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
      <Typography align='center' variant='h2' className={classes.header}>Token exchange</Typography>
      <Grid container justify='center' direction="row" alignItems="center" spacing={2}>
        <TokenPanel baseToken={BaseTokensEnum.TokenA}/>
        <ExchangePanel />
        <TokenPanel baseToken={BaseTokensEnum.TokenB}/>
      </Grid>
    </Paper>
  )
}

export default App
