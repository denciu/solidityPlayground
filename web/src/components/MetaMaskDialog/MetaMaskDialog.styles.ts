import { makeStyles } from '@material-ui/core/styles'

export const useMetaMaskDialogStyles = makeStyles(({ spacing }) => ({
  progress: {
    width: '100%',
    '& > * + *': {
      marginTop: spacing(2)
    }
  },
  dialog: {
    height: '200px',
    width: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing(3)
  }
}))
