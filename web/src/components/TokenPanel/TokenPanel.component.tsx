import React from 'react'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import FormControl from '@material-ui/core/FormControl'
import CardActions from '@material-ui/core/CardActions'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'

import { useTokenPanelStyles } from './TokenPanel.styles'
import { useTokenDetails } from './TokenPanel.hooks'
import { TokenPanelProps } from './TokenPanel.types'
import { BaseTokensEnum } from '../../utils/utils'
import { useInputs } from '../../context/inputs'

export const TokenPanel = ({ baseToken }: TokenPanelProps) => {
  const {
    name,
    symbol,
    isOwner,
    withdraw,
    deposit,
    disabled,
    TExBalance,
    usersBalance,
    getFaucet
  } = useTokenDetails(baseToken)
  const inputs = useInputs()
  const classes = useTokenPanelStyles({ baseToken })

  const { onChange, onClick, value } = inputs[baseToken]

  const colorPalette = baseToken === BaseTokensEnum.TokenA ? 'primary' : 'secondary'

  return (
    <Grid item xs={11} md={4} lg={3}>
      <Card variant='outlined' className={classes.center}>
        <CardHeader title={name} classes={{
          root: classes.header
        }} />
        <CardContent>
          <Typography>Your balance:</Typography>
          <Typography variant='body2' className={classes.margin}>{usersBalance} {symbol}</Typography>

          <Typography>Exchange balance:</Typography>
          <Typography variant='body2' className={classes.margin}>{TExBalance} {symbol}</Typography>

          <FormControl className={classes.textField} variant="outlined" color={colorPalette}>
            <OutlinedInput
              className={classes.adornment}
              disabled={disabled}
              fullWidth
              value={value}
              onChange={onChange}
              endAdornment={
                <InputAdornment position="end">{symbol}</InputAdornment>
              }
              type='number'
              placeholder = '0.00'
              inputProps={{
                step: '0.01',
                min: 0
              }}
            />
          </FormControl>
          {isOwner &&
            <CardActions >
              <Button
                variant='contained'
                className={classes.button}
                color={colorPalette}
                disabled={disabled}
                onClick={onClick(deposit)}
              >
                Deposit
              </Button>
              <Button
                variant='contained'
                className={classes.button}
                color={colorPalette}
                disabled={disabled}
                onClick={onClick(withdraw)}
              >
                Withdraw
              </Button>
            </CardActions>
          }
          <CardActions>
            <Button
              variant='contained'
              className={classes.fullWidthButton}
              color={colorPalette}
              disabled={disabled}
              onClick={() => getFaucet()}
            >
              Get funds
            </Button>
          </CardActions>

        </CardContent>
      </Card>
    </Grid>
  )
}
