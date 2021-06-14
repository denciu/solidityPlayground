import React from 'react'
import Grid from '@material-ui/core/Grid'
import Button from '@material-ui/core/Button'
import DoubleArrowRoundedIcon from '@material-ui/icons/DoubleArrowRounded'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { makeStyles, useTheme } from '@material-ui/core/styles'

const useStyles = makeStyles(({ breakpoints }) => ({
  button: {
    width: '100%'
  },
  fromIcon: {
    [breakpoints.down('sm')]: {
      transform: 'rotate(90deg)'
    }
  },
  toIcon: {
    transform: 'rotate(180deg)',
    [breakpoints.down('sm')]: {
      transform: 'rotate(-90deg)'
    }
  }
}))

export const ExchangePanel = () => {
  const theme = useTheme()
  const classes = useStyles()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid item container direction={isSmall ? 'row' : 'column'} justify='center' alignItems="center" xs={isSmall ? 12 : 2} spacing={2}>
      <Grid item xs={isSmall ? 5 : undefined}>
        <Button variant='contained' color='primary' className={classes.button}>
          <DoubleArrowRoundedIcon className={classes.fromIcon}/>
        </Button>
      </Grid>
      <Grid item xs={isSmall ? 5 : undefined}>
        <Button variant='contained' color='secondary' className={classes.button}>
          <DoubleArrowRoundedIcon className={classes.toIcon}/>
        </Button>
      </Grid>
    </Grid>
  )
}
