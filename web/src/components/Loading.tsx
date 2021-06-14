import React from 'react'
import { AsyncState } from '../utils/utils'
import LinearProgress from '@material-ui/core/LinearProgress'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'

export type LoadingProps = {
  state: AsyncState,
  children: React.ReactChildren
}

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: '100%',
    hieght: '100%'
  },
  pad: {
    padding: spacing(8)
  }
}))

export const Loading: React.FC<LoadingProps> = ({ state, children }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {state === 'ready' && { children }}
      {state === 'error' && <Typography align="center" className={classes.pad}>Something went wrong...</Typography>}
      {(state === 'loading' || state === 'idle') && <div><LinearProgress /></div>}
    </div>
  )
}
