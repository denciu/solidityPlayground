import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded'
import { useTheme } from '@material-ui/core/styles'

import { useExchangePanelStyles } from './ExchangePanel.styles'
import { useExchangePanel } from './ExchangePanel.hooks'
import { useInputs } from '../../context/inputs'
import { BaseTokensEnum } from '../../utils/utils'

export const ExchangePanel = () => {
  const theme = useTheme()
  const classes = useExchangePanelStyles()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const { disabled, makeExchange, exRate } = useExchangePanel()
  const inputs = useInputs()

  return (
    <Grid
      item
      container
      spacing={2}
      justify='center'
      alignItems="center"
      xs={isSmall ? 12 : 2}
      direction={isSmall ? 'row' : 'column'}
    >
      <Grid item xs={isSmall ? 4 : undefined}>
        <Button
          disabled={disabled}
          onClick={inputs.TA.onClick(async (val) => {
            await makeExchange(val, BaseTokensEnum.TokenA)
          })}
          variant='contained'
          color='primary'
          className={classes.button}
        >
          <DoubleArrowRoundedIcon className={classes.fromIcon}/>
        </Button>
      </Grid>
      <Grid
        item
        container
        justify='center'
        alignItems='center'
        xs={isSmall ? 2 : undefined}
      >
          <Typography variant='body2'>Rate: {exRate}</Typography>
      </Grid>
      <Grid item xs={isSmall ? 4 : undefined}>
        <Button
          disabled={disabled}
          onClick={inputs.TB.onClick(async (val) => {
            await makeExchange(val, BaseTokensEnum.TokenB)
          })}
          variant='contained'
          color='secondary'
          className={classes.button}
        >
          <DoubleArrowRoundedIcon className={classes.toIcon}/>
        </Button>
      </Grid>
    </Grid>
  )
}
