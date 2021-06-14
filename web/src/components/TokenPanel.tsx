import React, { useState } from 'react'

import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import Grid from '@material-ui/core/Grid'
import { BaseTokensEnum } from '../utils/utils'
import { useTokenDetails } from '../hooks/useTokenDetails'

import clsx from 'clsx'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputAdornment from '@material-ui/core/InputAdornment'
import FormControl from '@material-ui/core/FormControl'
import { makeStyles } from '@material-ui/core/styles'

export type TokenPanelProps = {
  baseToken: BaseTokensEnum
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  margin: {
    margin: theme.spacing(1)
  },
  withoutLabel: {
    marginTop: theme.spacing(3)
  },
  textField: {
    width: 'calc(100% - 14px)'
  },
  button: {
    width: '50%'
  },
  center: {
    textAlign: 'center'
  }
}))

export const TokenPanel = ({ baseToken }: TokenPanelProps) => {
  const { usersBalance, TExBalance, deposit, withdraw, name, symbol, isOwner, disabled } = useTokenDetails(baseToken)
  const [val, setVal] = useState('0')
  const classes = useStyles()

  const setTextNumber = (val: string) => {
    if (/^[0-9]*$/.test(val)) {
      setVal(val)
    }
  }

  const colorPalette = baseToken === BaseTokensEnum.TokenA ? 'primary' : 'secondary'

  return (
    <Grid item xs={12} md={3}>
      <Card variant='outlined' className={classes.center}>
        <CardHeader title={name} />
        <CardContent>
          <Typography>Your balance:</Typography>
          <Typography>{usersBalance} {symbol + 'wei'}</Typography>
          <Typography>Exchange balance:</Typography>
          <Typography>{TExBalance} {symbol + 'wei'}</Typography>

          <FormControl className={clsx(classes.margin, classes.textField)} variant="outlined" color={colorPalette}>
            <OutlinedInput
              fullWidth
              value={val}
              onChange={(e) => setTextNumber(e.target.value)}
              endAdornment={
                <InputAdornment position="end">{symbol + 'wei'}</InputAdornment>
              }
              type='text'
            />
          </FormControl>
          {isOwner &&
            <CardActions >
              <Button
                variant='contained'
                className={classes.button}
                color={colorPalette}
                disabled={disabled}
                onClick={() => {
                  deposit(val)
                  setVal('0')
                }}
              >
                Deposit
              </Button>
              <Button
                variant='contained'
                className={classes.button}
                color={colorPalette}
                disabled={disabled}
                onClick={() => {
                  withdraw(val)
                  setVal('0')
                }}
              >
                Withdraw
              </Button>
            </CardActions>
          }

        </CardContent>
      </Card>
    </Grid>
  )
}
