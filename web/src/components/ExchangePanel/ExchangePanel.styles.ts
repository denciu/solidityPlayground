import { makeStyles } from '@material-ui/core/styles'

export const useExchangePanelStyles = makeStyles(({ breakpoints }) => ({
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
